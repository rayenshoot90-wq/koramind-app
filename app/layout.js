import './globals.css'

export const metadata = {
  title: 'KoraMind AI - تحليلات ونتائج مباريات كرة القدم',
  description: 'موقع كورة ذكي مع تحليلات مباشرة باستخدام الذكاء الاصطناعي',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-koraDark min-h-screen text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
