"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent
} from "react";
import { TextAreaField, TextField } from "./lux-form-fields";
import { pushDataLayer, trackReviewsScroll } from "../lib/tracking";
import type { DynamicRouteReview } from "../lib/route-page-data";
import { supabase } from "../lib/supabase";

type ReviewsSectionProps = {
  location: "homepage" | "route_page";
  className?: string;
  routeLabel?: string;
  routeSlug?: string | null;
  reviews?: DynamicRouteReview[];
  language?: "ua" | "ru";
};

type MediaType = "instagram" | "messenger" | "photo" | "video";

type ReviewItem = {
  id: string;
  name: string;
  route: string;
  rating: number;
  text: string;
  hasMedia: boolean;
  mediaUrl?: string;
  mediaType?: MediaType;
};

type ReviewFormState = {
  name: string;
  rating: number;
  review: string;
};

type ReviewFormErrors = Partial<{
  name: string;
  rating: string;
  review: string;
}>;

const reviewFormInitialState: ReviewFormState = {
  name: "",
  rating: 5,
  review: ""
};

function getMediaPreviewMeta(language: "ua" | "ru") {
  const isRu = language === "ru";

  return {
    instagram: {
      title: isRu ? "Скрин отзыва из Instagram" : "Скрин відгуку з Instagram",
      Icon: InstagramIcon
    },
    messenger: {
      title: isRu ? "Скрин переписки с клиентом" : "Скрин переписки з клієнтом",
      Icon: MessengerIcon
    },
    photo: {
      title: isRu ? "Фото после поездки" : "Фото після поїздки",
      Icon: PhotoIcon
    },
    video: {
      title: isRu ? "Видеоотзыв клиента" : "Відеовідгук клієнта",
      Icon: VideoIcon
    }
  } satisfies Record<MediaType, { title: string; Icon: typeof PhotoIcon }>;
}

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function renderStars(count: number, className?: string) {
  return (
    <div
      className={cx("flex items-center gap-1.5 text-[var(--champagne)]", className)}
      aria-label={`${count} з 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          className={cx(
            "h-4 w-4",
            index < count ? "opacity-100" : "opacity-25"
          )}
        />
      ))}
    </div>
  );
}

export function ReviewsSection({
  location,
  className,
  routeLabel,
  routeSlug,
  reviews,
  language = "ua"
}: ReviewsSectionProps) {
  const pageType = location === "homepage" ? "home" : "route";
  const isRu = language === "ru";
  const ui = {
    sectionEyebrow: isRu ? "ОТЗЫВЫ КЛИЕНТОВ" : "ВІДГУКИ КЛІЄНТІВ",
    sectionTitle: isRu
      ? "Реальные впечатления после поездок"
      : "Реальні враження після поїздок",
    sectionSubtitle: isRu
      ? "Короткие отзывы клиентов после частных трансферов Украина — Молдова — Польша."
      : "Короткі відгуки клієнтів після приватних трансферів Україна — Молдова — Польща.",
    ratingLabel: isRu ? "Рейтинг сервиса" : "Рейтинг сервісу",
    ratingBasedOn: isRu ? "На основе реальных поездок" : "На основі реальних поїздок",
    leaveReview: isRu ? "ОСТАВИТЬ ОТЗЫВ" : "ЗАЛИШИТИ ВІДГУК",
    loading: isRu ? "Загружаем отзывы..." : "Завантажуємо відгуки...",
    empty: isRu ? "Отзывы скоро появятся." : "Відгуки скоро з’являться.",
    mediaButton: isRu ? "Смотреть скрин" : "Дивитись скрин",
    scrollHint: isRu ? "Листайте отзывы" : "Гортайте відгуки",
    reviewsCountSuffix: isRu ? "отзывов" : "відгуків",
    closeReviewForm: isRu ? "Закрыть форму отзыва" : "Закрити форму відгуку",
    formEyebrow: isRu ? "ОСТАВИТЬ ОТЗЫВ" : "ЗАЛИШИТИ ВІДГУК",
    formTitle: isRu
      ? "Поделитесь впечатлением после поездки"
      : "Поділіться враженням після поїздки",
    nameLabel: isRu ? "Имя" : "Ім’я",
    namePlaceholder: isRu ? "Ваше имя" : "Ваше ім’я",
    ratingField: isRu ? "Оценка" : "Оцінка",
    ratingAriaPrefix: isRu ? "Оценка" : "Оцінка",
    reviewLabel: isRu ? "Отзыв" : "Відгук",
    reviewPlaceholder: isRu ? "Напишите коротко о поездке" : "Напишіть коротко про поїздку",
    submitSending: isRu ? "ОТПРАВЛЯЕМ..." : "НАДСИЛАЄМО...",
    submitReview: isRu ? "ОТПРАВИТЬ ОТЗЫВ" : "НАДІСЛАТИ ВІДГУК",
    thanksEyebrow: isRu ? "СПАСИБО" : "ДЯКУЄМО",
    thanksTitle: isRu ? "Отзыв получен" : "Відгук отримано",
    thanksBody: isRu
      ? "Спасибо за отзыв. После проверки он может быть опубликован на сайте."
      : "Дякуємо за відгук. Після перевірки він може бути опублікований на сайті.",
    close: isRu ? "Закрыть" : "Закрити",
    addAnother: isRu ? "Добавить ещё один" : "Додати ще один",
    closePreview: isRu ? "Закрыть просмотр" : "Закрити перегляд",
    mediaEyebrow: isRu ? "МЕДИА ОТЗЫВ" : "МЕДІА ВІДГУК",
    prevReviews: isRu ? "Предыдущие отзывы" : "Попередні відгуки",
    nextReviews: isRu ? "Следующие отзывы" : "Наступні відгуки",
    errors: {
      name: isRu ? "Укажите имя." : "Вкажіть ім’я.",
      rating: isRu ? "Выберите оценку." : "Оберіть оцінку.",
      review: isRu ? "Напишите короткий отзыв." : "Напишіть короткий відгук.",
      submit: isRu
        ? "Сейчас не удалось отправить отзыв. Попробуйте позже."
        : "Наразі не вдалося надіслати відгук. Спробуйте пізніше."
    }
  };
  const sectionRef = useRef<HTMLElement | null>(null);
  const reviewsTrackRef = useRef<HTMLDivElement | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMediaReview, setSelectedMediaReview] = useState<ReviewItem | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(32);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [formState, setFormState] = useState<ReviewFormState>(
    reviewFormInitialState
  );
  const [formErrors, setFormErrors] = useState<ReviewFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolvedReviews, setResolvedReviews] = useState<DynamicRouteReview[]>(
    reviews ?? []
  );
  const [reviewsLoaded, setReviewsLoaded] = useState(Boolean(reviews));
  const supabaseReviews = mapSupabaseReviewsToViewModel(
    resolvedReviews,
    routeLabel,
    language
  );
  const visibleReviews = supabaseReviews;
  const ratingAverage =
    supabaseReviews.length > 0
      ? Math.round(
          (supabaseReviews.reduce((sum, review) => sum + review.rating, 0) /
            supabaseReviews.length) *
            10
        ) / 10
      : 4.9;
  const reviewsCount = visibleReviews.length;

  useEffect(() => {
    if (reviews) {
      setResolvedReviews(reviews);
      setReviewsLoaded(true);
      return;
    }

    let isMounted = true;

    async function loadApprovedReviews() {
      if (!supabase) {
        if (isMounted) {
          setResolvedReviews([]);
          setReviewsLoaded(true);
        }
        return;
      }

      const { data, error } = await supabase
        .from("reviews")
        .select(
          "id, route_slug, name, rating, text, media_url, media_type, status, created_at"
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!isMounted) {
        return;
      }

      if (error || !data) {
        setResolvedReviews([]);
        setReviewsLoaded(true);
        return;
      }

      const normalizedReviews = data as DynamicRouteReview[];
      const routeSlugs = Array.from(
        new Set(
          normalizedReviews
            .map((review) => review.route_slug)
            .filter((slug): slug is string => Boolean(slug))
        )
      );

      if (routeSlugs.length === 0) {
        setResolvedReviews(normalizedReviews);
        setReviewsLoaded(true);
        return;
      }

      const { data: routesData } = await supabase
        .from("routes")
        .select("slug, from_city, to_city")
        .in("slug", routeSlugs);

      const routeMetaBySlug = new Map(
        ((routesData as Array<{
          slug: string;
          from_city: string | null;
          to_city: string | null;
        }> | null) || []
        ).map((route) => [route.slug, route])
      );

      setResolvedReviews(
        normalizedReviews.map((review) => {
          const routeMeta = review.route_slug
            ? routeMetaBySlug.get(review.route_slug)
            : null;

          return {
            ...review,
            route_from_city: routeMeta?.from_city ?? null,
            route_to_city: routeMeta?.to_city ?? null
          };
        })
      );
      setReviewsLoaded(true);
    }

    void loadApprovedReviews();

    return () => {
      isMounted = false;
    };
  }, [reviews]);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    let hasTracked = false;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!hasTracked && entry.isIntersecting) {
            hasTracked = true;
            trackReviewsScroll({ location });
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [location]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const shouldLockScroll = isFormOpen || Boolean(selectedMediaReview);

    if (!shouldLockScroll) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFormOpen, selectedMediaReview]);

  useEffect(() => {
    if (!isFormOpen && !selectedMediaReview) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsFormOpen(false);
      setSelectedMediaReview(null);
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFormOpen, selectedMediaReview]);

  useEffect(() => {
    const track = reviewsTrackRef.current;

    if (!track) {
      return;
    }

    function updateScrollMetrics() {
      const activeTrack = reviewsTrackRef.current;

      if (!activeTrack) {
        return;
      }

      const maxScroll = Math.max(activeTrack.scrollWidth - activeTrack.clientWidth, 0);
      const nextProgress = maxScroll > 0 ? activeTrack.scrollLeft / maxScroll : 0;
      const visibleRatio =
        activeTrack.scrollWidth > 0
          ? activeTrack.clientWidth / activeTrack.scrollWidth
          : 1;

      setScrollProgress(nextProgress);
      setThumbWidth(Math.min(100, Math.max(18, visibleRatio * 100)));
      setCanScrollLeft(activeTrack.scrollLeft > 8);
      setCanScrollRight(activeTrack.scrollLeft < maxScroll - 8);
    }

    updateScrollMetrics();
    track.addEventListener("scroll", updateScrollMetrics, { passive: true });
    window.addEventListener("resize", updateScrollMetrics);

    return () => {
      track.removeEventListener("scroll", updateScrollMetrics);
      window.removeEventListener("resize", updateScrollMetrics);
    };
  }, []);

  function openReviewForm() {
    setIsSubmitted(false);
    setFormErrors({});
    setSubmitError(null);
    setIsFormOpen(true);
    pushDataLayer({
      event: "review_form_open",
      page_type: pageType
    });
  }

  function closeReviewForm() {
    setSubmitError(null);
    setIsFormOpen(false);
  }

  function closeMediaPreview() {
    setSelectedMediaReview(null);
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    setIsFormOpen(false);
    setSelectedMediaReview(null);
  }

  function clearFieldError(field: keyof ReviewFormErrors) {
    setFormErrors(current => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ReviewFormErrors = {};
    const trimmedName = formState.name.trim();
    const trimmedReview = formState.review.trim();

    if (!trimmedName) {
      nextErrors.name = ui.errors.name;
    }

    if (!formState.rating || formState.rating < 1) {
      nextErrors.rating = ui.errors.rating;
    }

    if (!trimmedReview) {
      nextErrors.review = ui.errors.review;
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      setSubmitError(null);
      return;
    }

    if (!supabase) {
      setSubmitError(ui.errors.submit);
      return;
    }

    setFormErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } = await supabase.from("reviews").insert([
      {
        route_slug: location === "route_page" ? routeSlug ?? null : null,
        name: trimmedName,
        rating: formState.rating,
        text: trimmedReview,
        media_url: null,
        media_type: null,
        status: "pending",
        created_at: new Date().toISOString()
      }
    ]);

    if (error) {
      setSubmitError(ui.errors.submit);
      setIsSubmitting(false);
      return;
    }

    pushDataLayer({
      event: "review_submit_mock",
      page_type: pageType,
      rating: formState.rating
    });
    setFormState(reviewFormInitialState);
    setHoveredRating(null);
    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  function handleMediaOpen(review: ReviewItem) {
    if (!review.hasMedia || !review.mediaType) {
      return;
    }

    pushDataLayer({
      event: "review_media_click",
      media_type: review.mediaType,
      route: review.route,
      page_type: pageType
    });
    setSelectedMediaReview(review);
  }

  function resetFormState() {
    setFormState(reviewFormInitialState);
    setFormErrors({});
    setSubmitError(null);
    setHoveredRating(null);
    setIsSubmitting(false);
    setIsSubmitted(false);
  }

  function scrollReviews(direction: "prev" | "next") {
    const track = reviewsTrackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector<HTMLElement>("[data-review-card]");
    const computedStyles = window.getComputedStyle(track);
    const gap =
      Number.parseFloat(computedStyles.columnGap || computedStyles.gap || "0") || 0;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? track.clientWidth * 0.84;
    const scrollAmount = cardWidth + gap;

    track.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth"
    });
  }

  const mediaPreviewMeta = getMediaPreviewMeta(language);
  const selectedMediaMeta =
    selectedMediaReview?.mediaType &&
    mediaPreviewMeta[selectedMediaReview.mediaType];

  return (
    <>
      <section
        ref={sectionRef}
        className={cx(
          "relative overflow-hidden rounded-[30px] border border-[rgba(230,213,170,0.12)] bg-[rgba(8,10,9,0.62)] px-5 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:px-7 md:px-8 md:py-12 xl:px-10",
          className
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(234,214,172,0.18),transparent)]" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-8">
          <div className="max-w-[46rem]">
            <p className="eyebrow-lux">{ui.sectionEyebrow}</p>
            <h2 className="section-title-lux mt-4 text-[2.1rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] md:text-[2.7rem] lg:text-[3rem]">
              {ui.sectionTitle}
            </h2>
            <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-7 text-[var(--muted)] md:text-[1.02rem]">
              {ui.sectionSubtitle}
            </p>
          </div>
          <div className="reviews-card gap-4 rounded-[24px] p-5 sm:p-6">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
                {ui.ratingLabel}
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-[2rem] font-semibold leading-none text-[var(--text)]">
                  {ratingAverage.toFixed(1)}
                </span>
                <span className="pb-1 text-[0.96rem] text-[var(--muted)]">
                  / 5
                </span>
              </div>
              <div className="mt-3">{renderStars(Math.round(ratingAverage))}</div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {ui.ratingBasedOn}
              </p>
            </div>
            <button
              type="button"
              onClick={openReviewForm}
            className="button-gold inline-flex h-12 items-center justify-center rounded-full px-5 text-[0.74rem] font-bold uppercase tracking-[0.14em]"
          >
            {ui.leaveReview}
          </button>
          </div>
        </div>

        <div className="mt-8">
          <div
            ref={reviewsTrackRef}
            className="reviews-row flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-8 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Горизонтальний список відгуків"
          >
            {!reviewsLoaded ? (
              <div className="reviews-card flex min-h-[220px] w-full items-center justify-center rounded-[24px] p-6 text-center">
                <p className="max-w-[28rem] text-[0.98rem] leading-7 text-[var(--muted)]">
                  {ui.loading}
                </p>
              </div>
            ) : visibleReviews.length > 0 ? (
              visibleReviews.map(review => (
                <article
                  key={review.id}
                  data-review-card
                  className="reviews-card min-h-[100%] w-[84vw] max-w-[84vw] shrink-0 snap-start sm:w-[22rem] sm:max-w-[22rem] lg:w-[20rem] lg:max-w-[20rem] xl:w-[21.5rem] xl:max-w-[21.5rem]"
                >
                  {renderStars(review.rating, "mb-4")}
                  <p className="text-[0.98rem] leading-7 text-[var(--text)]">
                    {review.text}
                  </p>
                  <div className="mt-auto pt-6">
                    <div className="text-[1rem] font-semibold text-[var(--text)]">
                      {review.name}
                    </div>
                    {review.route ? (
                      <div className="mt-1 text-sm leading-6 text-[var(--muted)]">
                        {review.route}
                      </div>
                    ) : null}
                    {review.hasMedia && review.mediaType ? (
                      <button
                        type="button"
                        onClick={() => handleMediaOpen(review)}
                        className="button-outline mt-5 inline-flex h-10 items-center justify-center rounded-full px-4 text-[0.7rem] font-bold uppercase tracking-[0.12em]"
                      >
                        {ui.mediaButton}
                      </button>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="reviews-card flex min-h-[220px] w-full items-center justify-center rounded-[24px] p-6 text-center">
                <p className="max-w-[28rem] text-[0.98rem] leading-7 text-[var(--muted)]">
                  {ui.empty}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollReviews("prev")}
                disabled={!canScrollLeft}
                className={cx(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full border transition",
                  canScrollLeft
                    ? "border-[rgba(230,213,170,0.18)] bg-[rgba(12,16,13,0.56)] text-[var(--soft-gold)] hover:border-[rgba(230,213,170,0.3)]"
                    : "cursor-not-allowed border-[rgba(230,213,170,0.08)] bg-[rgba(12,16,13,0.24)] text-[rgba(183,178,168,0.42)]"
                )}
                aria-label={ui.prevReviews}
              >
                <ArrowIcon className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => scrollReviews("next")}
                disabled={!canScrollRight}
                className={cx(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full border transition",
                  canScrollRight
                    ? "border-[rgba(230,213,170,0.18)] bg-[rgba(12,16,13,0.56)] text-[var(--soft-gold)] hover:border-[rgba(230,213,170,0.3)]"
                    : "cursor-not-allowed border-[rgba(230,213,170,0.08)] bg-[rgba(12,16,13,0.24)] text-[rgba(183,178,168,0.42)]"
                )}
                aria-label={ui.nextReviews}
              >
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <div className="relative h-2.5 overflow-hidden rounded-full bg-[rgba(230,213,170,0.08)]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-[linear-gradient(90deg,#c59c5e,#f1d7a3)] shadow-[0_0_18px_rgba(216,185,130,0.22)] transition-[left,width] duration-200"
                  style={{
                    width: `${thumbWidth}%`,
                    left: `${scrollProgress * (100 - thumbWidth)}%`
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[rgba(216,185,130,0.72)]">
                <span>{ui.scrollHint}</span>
                <span>{reviewsCount} {ui.reviewsCountSuffix}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFormOpen ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-[rgba(5,7,6,0.82)] px-4 py-6 backdrop-blur-sm"
          onClick={handleOverlayClick}
          role="presentation"
        >
          <div className="panel-glass relative max-h-[90vh] w-full max-w-[36rem] overflow-y-auto rounded-[26px] p-5 sm:p-7">
            <button
              type="button"
              onClick={closeReviewForm}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(230,213,170,0.14)] bg-[rgba(12,16,13,0.56)] text-[var(--soft-gold)] transition hover:border-[rgba(230,213,170,0.28)]"
              aria-label={ui.closeReviewForm}
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            {!isSubmitted ? (
              <>
                <p className="eyebrow-lux">{ui.formEyebrow}</p>
                <h3 className="section-title-lux mt-4 pr-10 text-[2rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] sm:text-[2.35rem]">
                  {ui.formTitle}
                </h3>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <TextField
                    label={ui.nameLabel}
                    name="reviewer-name"
                    autoComplete="name"
                    placeholder={ui.namePlaceholder}
                    value={formState.name}
                    error={formErrors.name}
                    onChange={event =>
                      {
                        clearFieldError("name");
                        setSubmitError(null);
                        setFormState(current => ({
                          ...current,
                          name: event.target.value
                        }));
                      }
                    }
                    fieldClassName="h-14 rounded-[16px] px-4"
                  />

                  <div className="field-group">
                    <div className="flex items-center justify-between gap-3">
                      <span className="field-label mb-0">{ui.ratingField}</span>
                      <span className="text-sm text-[var(--muted)]">
                        {hoveredRating ?? formState.rating} / 5
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.from({ length: 5 }, (_, index) => {
                        const value = index + 1;
                        const isActive = value <= (hoveredRating ?? formState.rating);

                        return (
                          <button
                            key={value}
                            type="button"
                            onMouseEnter={() => setHoveredRating(value)}
                            onMouseLeave={() => setHoveredRating(null)}
                            onClick={() =>
                              {
                                clearFieldError("rating");
                                setSubmitError(null);
                                setFormState(current => ({
                                  ...current,
                                  rating: value
                                }));
                              }
                            }
                            className={cx(
                              "inline-flex h-12 w-12 items-center justify-center rounded-full border transition",
                              isActive
                                ? "border-[rgba(230,213,170,0.34)] bg-[rgba(216,185,130,0.12)] text-[var(--champagne)]"
                                : "border-[rgba(230,213,170,0.12)] bg-[rgba(12,16,13,0.56)] text-[rgba(247,243,234,0.45)]"
                            )}
                            aria-label={`${ui.ratingAriaPrefix} ${value} з 5`}
                          >
                            <StarIcon className="h-5 w-5" />
                          </button>
                        );
                      })}
                    </div>
                    {formErrors.rating ? (
                      <span className="field-error">{formErrors.rating}</span>
                    ) : null}
                  </div>

                  <TextAreaField
                    label={ui.reviewLabel}
                    name="review-text"
                    placeholder={ui.reviewPlaceholder}
                    value={formState.review}
                    error={formErrors.review}
                    onChange={event =>
                      {
                        clearFieldError("review");
                        setSubmitError(null);
                        setFormState(current => ({
                          ...current,
                          review: event.target.value
                        }));
                      }
                    }
                    rows={5}
                    fieldClassName="min-h-[140px] rounded-[18px] px-4 py-4"
                  />

                  {submitError ? (
                    <p className="field-error">{submitError}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-gold inline-flex h-12 w-full items-center justify-center rounded-full px-5 text-[0.76rem] font-bold uppercase tracking-[0.14em]"
                  >
                    {isSubmitting ? ui.submitSending : ui.submitReview}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 pr-8">
                <p className="eyebrow-lux">{ui.thanksEyebrow}</p>
                <h3 className="section-title-lux mt-4 text-[2rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] sm:text-[2.25rem]">
                  {ui.thanksTitle}
                </h3>
                <p className="mt-4 max-w-[28rem] text-[1rem] leading-7 text-[var(--muted)]">
                  {ui.thanksBody}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      closeReviewForm();
                      resetFormState();
                    }}
                    className="button-gold inline-flex h-12 items-center justify-center rounded-full px-5 text-[0.74rem] font-bold uppercase tracking-[0.14em]"
                  >
                    {ui.close}
                  </button>
                  <button
                    type="button"
                    onClick={resetFormState}
                    className="button-outline inline-flex h-12 items-center justify-center rounded-full px-5 text-[0.74rem] font-bold uppercase tracking-[0.14em]"
                  >
                    {ui.addAnother}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {selectedMediaReview && selectedMediaMeta ? (
        <div
          className="fixed inset-0 z-[145] flex items-center justify-center bg-[rgba(5,7,6,0.84)] px-4 py-6 backdrop-blur-sm"
          onClick={handleOverlayClick}
          role="presentation"
        >
          <div className="panel-glass relative w-full max-w-[42rem] rounded-[26px] p-5 sm:p-7">
            <button
              type="button"
              onClick={closeMediaPreview}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(230,213,170,0.14)] bg-[rgba(12,16,13,0.56)] text-[var(--soft-gold)] transition hover:border-[rgba(230,213,170,0.28)]"
              aria-label={ui.closePreview}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <p className="eyebrow-lux">{ui.mediaEyebrow}</p>
            <h3 className="section-title-lux mt-4 pr-10 text-[2rem] font-medium leading-[1.04] tracking-[-0.04em] text-[var(--text)] sm:text-[2.3rem]">
              {selectedMediaMeta.title}
            </h3>
            <div className="mt-6 rounded-[24px] border border-[rgba(230,213,170,0.16)] bg-[linear-gradient(180deg,rgba(12,16,13,0.78),rgba(9,12,10,0.64))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {selectedMediaReview.mediaUrl ? (
                <div className="overflow-hidden rounded-[18px] border border-[rgba(230,213,170,0.18)] bg-[rgba(7,9,8,0.52)]">
                  <img
                    src={selectedMediaReview.mediaUrl}
                    alt={selectedMediaMeta.title}
                    className="block h-auto max-h-[70vh] w-full object-contain"
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-[18px] border border-dashed border-[rgba(230,213,170,0.18)] bg-[rgba(7,9,8,0.52)] px-6 py-8 text-center">
                  <selectedMediaMeta.Icon className="h-10 w-10 text-[var(--champagne)]" />
                  <p className="mt-4 text-[1.05rem] font-semibold text-[var(--text)]">
                    {selectedMediaMeta.title}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.96rem] font-semibold text-[var(--text)]">
                  {selectedMediaReview.name}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {selectedMediaReview.route}
                </p>
              </div>
              <button
                type="button"
                onClick={closeMediaPreview}
                className="button-outline inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.74rem] font-bold uppercase tracking-[0.12em]"
              >
                {ui.close}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function mapSupabaseReviewsToViewModel(
  reviews: DynamicRouteReview[] | undefined,
  routeLabel?: string,
  language: "ua" | "ru" = "ua"
): ReviewItem[] {
  if (!reviews || reviews.length === 0) {
    return [];
  }

  return reviews
    .filter((review) => review.name && review.text)
    .map((review) => ({
      id: review.id,
      name: review.name || (language === "ru" ? "Клиент" : "Клієнт"),
      route:
        review.route_from_city && review.route_to_city
          ? `${review.route_from_city} — ${review.route_to_city}`
          : review.route_slug || "",
      rating: normalizeRating(review.rating),
      text: review.text || "",
      hasMedia: Boolean(review.media_url),
      mediaUrl: review.media_url || undefined,
      mediaType: normalizeMediaType(review.media_type, review.media_url)
    }));
}

function normalizeMediaType(
  mediaType: string | null,
  mediaUrl: string | null
): MediaType | undefined {
  if (!mediaUrl) {
    return undefined;
  }

  if (
    mediaType === "instagram" ||
    mediaType === "messenger" ||
    mediaType === "photo" ||
    mediaType === "video"
  ) {
    return mediaType;
  }

  return "photo";
}

function normalizeRating(rating: number | null) {
  if (!rating || Number.isNaN(rating)) {
    return 5;
  }

  return Math.max(1, Math.min(5, Math.round(rating)));
}

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 1.8 12.44 6.75l5.47.8-3.96 3.86.93 5.45L10 14.27l-4.88 2.59.93-5.45L2.08 7.55l5.47-.8L10 1.8Z" />
    </svg>
  );
}

function CloseIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h13m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3.3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.1" cy="6.9" r="1" fill="currentColor" />
    </svg>
  );
}

function MessengerIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4.5c-4.7 0-8.5 3.4-8.5 7.7 0 2.4 1.2 4.5 3.3 5.9v2.9l2.8-1.6c.7.2 1.5.3 2.4.3 4.7 0 8.5-3.4 8.5-7.6S16.7 4.5 12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m8.4 13.2 2.4-2.6 2.2 1.8 2.4-2.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhotoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="9" cy="10" r="1.7" fill="currentColor" />
      <path
        d="m6.5 16 3.3-3.4 2.6 2.4 2.2-2.2 2.9 3.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="3.5"
        y="6"
        width="11"
        height="12"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m14.5 10 5-2v8l-5-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
