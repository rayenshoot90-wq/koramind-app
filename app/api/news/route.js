import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { query } = await req.json();

    // ردود أذكياء وهمية/مجهزة (يمكن ربطها مستقبلاً بـ Gemini API أو OpenAI)
    let reply = `بناءً على تحليلي الرياضي لسؤالك ("${query}"): الفريق يمر بفترة إعداد جيدة وسلسلة المباريات الودية الأخيرة أظهرت تحسناً في الخط الهجومي ونسبة الاستحواذ.`;

    if (query.includes("ودية") || query.includes("مباراة")) {
      reply = `المباريات الودية الحالية تعتبر فرصة للمدرب لتجربة خطة 4-3-3 والاعتماد على العناصر الشابة في خط الوسط.`;
    } else if (query.includes("مدريد") || query.includes("برشلونة")) {
      reply = `الكلاسيكو القادم يشهد جاهزية عالية للطرفين، والتحليل الرقمي يعطي أفضلية بسيطة للضغط العالي في أول 20 دقيقة.`;
    }

    return NextResponse.json({ result: reply });
  } catch (error) {
    return NextResponse.json({ result: "حدث خطأ أثناء معالجة استفسارك بالذكاء الاصطناعي." }, { status: 500 });
  }
}
