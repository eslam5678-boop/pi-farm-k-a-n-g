export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>
      <h2>الصفحة غير موجودة</h2>
      <p>عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>العودة للرئيسية</a>
    </div>
  );
}
