import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    // بيانات احتياطية تجريبية في حال عدم ضبط المفتاح
    return NextResponse.json({
      response: [
        {
          fixture: { id: 1, status: { short: 'FT' }, date: new Date().toISOString() },
          league: { name: 'الدوري الإسباني', logo: 'https://media.api-sports.io/football/leagues/140.png' },
          teams: {
            home: { name: 'ريال مدريد', logo: 'https://media.api-sports.io/football/teams/541.png' },
            away: { name: 'برشلونة', logo: 'https://media.api-sports.io/football/teams/529.png' }
          },
          goals: { home: 2, away: 1 }
        },
        {
          fixture: { id: 2, status: { short: '2H', elapsed: 75 }, date: new Date().toISOString() },
          league: { name: 'الدوري الإنجليزي', logo: 'https://media.api-sports.io/football/leagues/39.png' },
          teams: {
            home: { name: 'مانشستر سيتي', logo: 'https://media.api-sports.io/football/teams/50.png' },
            away: { name: 'ليفربول', logo: 'https://media.api-sports.io/football/teams/40.png' }
          },
          goals: { home: 1, away: 1 }
        }
      ]
    });
  }

  try {
    const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: {
        'x-apisports-key': API_KEY,
      },
      next: { revalidate: 60 } // تحديث كل دقيقة
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب البيانات' }, { status: 500 });
  }
}import { NextResponse } from 'next/server';

export async function GET() {
  const dummyMatches = [
    {
      id: 1,
      homeTeam: "ريال مدريد",
      awayTeam: "برشلونة",
      homeScore: 2,
      awayScore: 1,
      status: "LIVE",
      minute: "75'",
      league: "الدوري الإسباني"
    },
    {
      id: 2,
      homeTeam: "مانشستر سيتي",
      awayTeam: "ليفربول",
      homeScore: 0,
      awayScore: 0,
      status: "UPCOMING",
      time: "20:00",
      league: "الدوري الإنجليزي"
    },
    {
      id: 3,
      homeTeam: "الأهلي",
      awayTeam: "الزمالك",
      homeScore: 3,
      awayScore: 1,
      status: "FINISHED",
      league: "الدوري المصري"
    }
  ];

  return NextResponse.json({ matches: dummyMatches });
}
