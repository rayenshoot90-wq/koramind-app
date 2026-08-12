import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export async function POST(req) {
  try {
    const { homeTeam, awayTeam, league } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        analysis: `تحليل افتراضي: مباراة حماسية مرتقبة بين ${homeTeam} و ${awayTeam} ضمن بطولة ${league}. يُتوقع اعتماد الضغط العالي من الطرفين وتألق الأجنحة.`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "أنت محلل رياضي محترف. قدم تحليلاً فنياً مختصراً وممتعاً باللغة العربية لمباراة كرة قدم بناءً على أسم الفريقين والبطولة."
        },
        {
          role: "user",
          content: `قم بتحليل مباراة: ${homeTeam} ضد ${awayTeam} في بطولة ${league}.`
        }
      ],
      max_tokens: 200,
    });

    return NextResponse.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء إعداد التحليل' }, { status: 500 });
  }
}
