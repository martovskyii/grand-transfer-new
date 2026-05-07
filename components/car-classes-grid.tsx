import Image, { type StaticImageData } from "next/image";

type IconProps = {
  className?: string;
};

export type CarClassCardData = {
  title: string;
  description: string;
  image: StaticImageData;
  models: string[];
  seats: string;
  luggage: string;
  climate: string;
  price: string;
};

type CarClassesGridProps = {
  cards: CarClassCardData[];
  className?: string;
  compact?: boolean;
  showModels?: boolean;
  onImageClick?: (card: CarClassCardData) => void;
};

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export function CarClassesGrid({
  cards,
  className,
  compact = false,
  showModels = true,
  onImageClick
}: CarClassesGridProps) {
  return (
    <div
      className={cx(
        compact
          ? "grid gap-3 min-[520px]:grid-cols-2 lg:grid-cols-2"
          : "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {cards.map(
        ({ title, description, image, models, seats, luggage, climate, price }) => (
          <article
            key={title}
            className={cx("autopark-class-card", compact && "is-compact")}
          >
            <div className="mt-1">
              <h2
                className={cx(
                  "font-semibold tracking-[-0.02em] text-[var(--text)]",
                  compact ? "text-[1.12rem]" : "text-[1.36rem]"
                )}
              >
                {title}
              </h2>
              {!compact ? (
                <p className="mt-3 text-[0.93rem] leading-[1.68] text-[var(--muted)]">
                  {description}
                </p>
              ) : null}
            </div>

            {showModels ? (
              <div
                className={cx(
                  "autopark-models-block mt-4",
                  compact && "is-compact"
                )}
              >
                <p className="autopark-models-title">Моделі авто</p>
                <div className="autopark-models-grid mt-3">
                  {models.map((model) => (
                    <span key={model} className="autopark-model-item">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {onImageClick ? (
              <button
                type="button"
                onClick={() =>
                  onImageClick({
                    title,
                    description,
                    image,
                    models,
                    seats,
                    luggage,
                    climate,
                    price
                  })
                }
                className={cx(
                  "autopark-image-button autopark-class-image-shell mt-5",
                  compact && "is-compact"
                )}
                aria-label={`Відкрити зображення авто ${title}`}
              >
                <Image
                  src={image}
                  alt={title}
                  className={cx(
                    "autopark-class-image h-full w-full object-contain object-center",
                    compact && "is-compact"
                  )}
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                />
              </button>
            ) : (
              <div
                className={cx(
                  "autopark-class-image-shell mt-5",
                  compact && "is-compact"
                )}
              >
                <Image
                  src={image}
                  alt={title}
                  className={cx(
                    "autopark-class-image h-full w-full object-contain object-center",
                    compact && "is-compact"
                  )}
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                />
              </div>
            )}

            <div className={cx("autopark-spec-grid mt-5", compact && "is-compact")}>
              <div className={cx("autopark-spec-item", compact && "is-compact")}>
                <PassengerIcon className="h-[18px] w-[18px]" />
                <span>{compact ? `${seats} пас.` : seats}</span>
              </div>
              <div className={cx("autopark-spec-item", compact && "is-compact")}>
                <LuggageIcon className="h-[18px] w-[18px]" />
                <span>{compact ? `${luggage} багаж` : luggage}</span>
              </div>
              <div className={cx("autopark-spec-item", compact && "is-compact")}>
                <ClimateIcon className="h-[18px] w-[18px]" />
                <span>{climate}</span>
              </div>
            </div>

            <div className={cx("autopark-price-row mt-5", compact && "is-compact")}>
              <span className={cx("autopark-price-prefix", compact && "is-compact")}>
                від
              </span>
              <span className={cx("autopark-price-value", compact && "is-compact")}>
                {price}
              </span>
            </div>
          </article>
        )
      )}
    </div>
  );
}

function PassengerIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M7 18c1-2.3 2.7-3.5 5-3.5s4 1.2 5 3.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LuggageIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 7V5.6A1.6 1.6 0 0 1 9.6 4h4.8A1.6 1.6 0 0 1 16 5.6V7M6 8h12a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.5v4M15 11.5v4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClimateIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.8v16.4M8.1 6l7.8 12M15.9 6 8.1 18M4.9 12h14.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
