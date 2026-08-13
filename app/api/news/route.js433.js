import { NextResponse } from 'next/server';

export async function GET() {
  const news = [
    {
      id: 1,
      title: "استعدادات قوية للمنتخبات العربية في المباريات الودية القادمة",
      category: "مباريات ودية",
      date: "منذ ساعة",
      image: "⚽"
    },
    {
      id: 2,
      title: "تطورات سوق الانتقالات الصيفية وتألق النجوم الجدد",
      category: "انتقالات",
      date: "منذ 3 ساعات",
      image: "🔥"
    },
    {
      id: 3,
      title: "تحليل الذكاء الاصطناعي: من الأقرب لحسم القمة القادمة؟",
      category: "تحليل AI",
      date: "منذ 5 ساعات",
      image: "🤖"
    }
  ];

  return NextResponse.json({ news });
}
