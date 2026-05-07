import { NextResponse } from "next/server";

type TelegramLeadPayload = {
  form_name?: string | null;
  name?: string | null;
  phone?: string | null;
  from?: string | null;
  to?: string | null;
  date?: string | null;
  passengers?: string | null;
  car_class?: string | null;
  comment?: string | null;
  page_url?: string | null;
  user_agent?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function formatValue(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? escapeHtml(trimmed) : "—";
}

function buildTelegramMessage(payload: TelegramLeadPayload) {
  return [
    "🚗 <b>Нова заявка</b>",
    "",
    `<b>Форма:</b> ${formatValue(payload.form_name)}`,
    "",
    `👤 <b>Ім’я:</b> ${formatValue(payload.name)}`,
    `📞 <b>Телефон:</b> ${formatValue(payload.phone)}`,
    "",
    `📍 <b>Маршрут:</b> ${formatValue(payload.from)} → ${formatValue(payload.to)}`,
    `📅 <b>Дата:</b> ${formatValue(payload.date)}`,
    `👥 <b>Пасажири:</b> ${formatValue(payload.passengers)}`,
    `🚘 <b>Клас авто:</b> ${formatValue(payload.car_class)}`,
    "",
    "💬 <b>Коментар:</b>",
    `${formatValue(payload.comment)}`,
    "",
    "🌐 <b>Сторінка:</b>",
    `${formatValue(payload.page_url)}`,
    "",
    "🧠 <b>User Agent:</b>",
    `${formatValue(payload.user_agent)}`,
    "",
    "📊 <b>UTM:</b>",
    `source: ${formatValue(payload.utm_source)}`,
    `medium: ${formatValue(payload.utm_medium)}`,
    `campaign: ${formatValue(payload.utm_campaign)}`,
    `content: ${formatValue(payload.utm_content)}`,
    `term: ${formatValue(payload.utm_term)}`
  ].join("\n");
}

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json(
      { success: false, error: "telegram_env_missing" },
      { status: 500 }
    );
  }

  let payload: TelegramLeadPayload;

  try {
    payload = (await request.json()) as TelegramLeadPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  const phone = payload.phone?.trim();

  if (!phone) {
    return NextResponse.json(
      { success: false, error: "phone_required" },
      { status: 400 }
    );
  }

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        text: buildTelegramMessage(payload)
      })
    }
  );

  if (!telegramResponse.ok) {
    return NextResponse.json(
      { success: false, error: "telegram_send_failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
