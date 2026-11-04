import type { Category, Condition, ConditionId, CategoryId, Designer } from "./types";

export const categories: Category[] = [
  {
    id: "bags",
    he: "תיקים",
    en: "Handbags",
    descriptionHe: "האייקונים של בתי האופנה, נבחרו אחד־אחד",
    image: "/images/bag-croc.jpg",
  },
  {
    id: "ready-to-wear",
    he: "ביגוד",
    en: "Ready-to-Wear",
    descriptionHe: "מעילים, שמלות ותפירה שלא יוצאים מהאופנה",
    image: "/images/rtw-trench.jpg",
  },
  {
    id: "shoes",
    he: "נעליים",
    en: "Shoes",
    descriptionHe: "עקבים, נעלי ערב וקלאסיקות יומיומיות",
    image: "/images/shoe-suede.jpg",
  },
  {
    id: "jewelry",
    he: "תכשיטים",
    en: "Fine Jewellery",
    descriptionHe: "פנינים, זהב ותכשיטים עם היסטוריה",
    image: "/images/jw-earrings.jpg",
  },
  {
    id: "accessories",
    he: "אקססוריז",
    en: "Accessories",
    descriptionHe: "שעונים, משקפי שמש והפרטים הקטנים שמשלימים",
    image: "/images/acc-sunglasses.jpg",
  },
];

export const conditions: Condition[] = [
  {
    id: "pristine",
    he: "כמו חדש",
    short: "כמו חדש",
    descriptionHe: "לא נעשה בו שימוש או שנעשה בו שימוש מזערי. ללא סימני בלאי נראים לעין.",
    grade: 4,
  },
  {
    id: "excellent",
    he: "מצב מצוין",
    short: "מצוין",
    descriptionHe: "נלבש בעדינות. ייתכנו סימנים קלים מאוד שנראים רק במבט קרוב.",
    grade: 3,
  },
  {
    id: "very-good",
    he: "מצב טוב מאוד",
    short: "טוב מאוד",
    descriptionHe: "נאהב ונלבש. סימני שימוש עדינים שמתוארים במלואם בדף הפריט.",
    grade: 2,
  },
  {
    id: "vintage",
    he: "וינטג׳",
    short: "וינטג׳",
    descriptionHe: "פריט מעל עשרים שנה, עם הפטינה והאופי שרק הזמן מעניק.",
    grade: 1,
  },
];

export const designers: Designer[] = [
  { slug: "chanel", name: "Chanel", originHe: "פריז", founded: 1910, noteHe: "האלגנטיות של גבריאל שאנל — טוויד, פנינים ושחור מושלם." },
  { slug: "dior", name: "Dior", originHe: "פריז", founded: 1946, noteHe: "ה־New Look ששינה את הצללית הנשית לנצח." },
  { slug: "the-row", name: "The Row", originHe: "ניו יורק", founded: 2006, noteHe: "מינימליזם שקט ובדים יוצאי דופן." },
  { slug: "max-mara", name: "Max Mara", originHe: "רג׳ו אמיליה", founded: 1951, noteHe: "המעיל האיטלקי המושלם, עונה אחרי עונה." },
  { slug: "valentino", name: "Valentino", originHe: "רומא", founded: 1960, noteHe: "רומנטיקה רומאית, אדום אייקוני ותפירה עילית." },
  { slug: "saint-laurent", name: "Saint Laurent", originHe: "פריז", founded: 1961, noteHe: "הביטחון הפריזאי במיטבו." },
  { slug: "bottega-veneta", name: "Bottega Veneta", originHe: "ויצ׳נצה", founded: 1966, noteHe: "קליעת העור המפורסמת — יוקרה בלי לוגו." },
  { slug: "loewe", name: "Loewe", originHe: "מדריד", founded: 1846, noteHe: "מלאכת עור ספרדית בת כמעט מאתיים שנה." },
  { slug: "miu-miu", name: "Miu Miu", originHe: "מילאנו", founded: 1993, noteHe: "שובבות מתוחכמת וחן נערי." },
  { slug: "chloe", name: "Chloé", originHe: "פריז", founded: 1952, noteHe: "נשיות בוהמיינית רכה וזורמת." },
  { slug: "delvaux", name: "Delvaux", originHe: "בריסל", founded: 1829, noteHe: "בית העור העתיק בעולם, שמור לאניני טעם." },
  { slug: "manolo-blahnik", name: "Manolo Blahnik", originHe: "לונדון", founded: 1970, noteHe: "הנעליים שכל ארון ראוי לו." },
  { slug: "gianvito-rossi", name: "Gianvito Rossi", originHe: "סן מאורו פסקולי", founded: 2006, noteHe: "קווים נקיים וגזרה מושלמת." },
  { slug: "dolce-gabbana", name: "Dolce & Gabbana", originHe: "מילאנו", founded: 1985, noteHe: "סיציליה בפריחה מלאה." },
  { slug: "brunello-cucinelli", name: "Brunello Cucinelli", originHe: "סולומאו", founded: 1978, noteHe: "יוקרה הומנית ושקטה מאומבריה." },
  { slug: "prada", name: "Prada", originHe: "מילאנו", founded: 1913, noteHe: "אינטלקט, ניילון ואוונגרד." },
  { slug: "giambattista-valli", name: "Giambattista Valli", originHe: "פריז", founded: 2005, noteHe: "שמלות שנועדו לרגעים בלתי נשכחים." },
  { slug: "alaia", name: "Alaïa", originHe: "פריז", founded: 1981, noteHe: "פיסול הגוף בבד — מסורת של שלמות." },
  { slug: "jacquemus", name: "Jacquemus", originHe: "פרובאנס", founded: 2009, noteHe: "שמש הדרום ופשטות פואטית." },
  { slug: "mikimoto", name: "Mikimoto", originHe: "טוקיו", founded: 1893, noteHe: "חלוצי הפנינה התרבותית." },
  { slug: "buccellati", name: "Buccellati", originHe: "מילאנו", founded: 1919, noteHe: "חריטת זהב ברוח הרנסנס." },
  { slug: "tiffany", name: "Tiffany & Co.", originHe: "ניו יורק", founded: 1837, noteHe: "יהלומים בקלאסיקה האמריקאית." },
  { slug: "hermes", name: "Hermès", originHe: "פריז", founded: 1837, noteHe: "האוּמנות כדת — מאז ימי הרתמות." },
  { slug: "cartier", name: "Cartier", originHe: "פריז", founded: 1847, noteHe: "תכשיטן המלכים." },
  { slug: "celine", name: "Celine", originHe: "פריז", founded: 1945, noteHe: "בורגנות פריזאית מודרנית." },
  { slug: "vintage-archive", name: "Archive", originHe: "אירופה", founded: 1920, noteHe: "פריטים עתיקים ללא חתימת בית, שנבחרו בזכות האומנות." },
];

export const getDesigner = (slug: string) => designers.find((d) => d.slug === slug)!;
export const getCondition = (id: ConditionId) => conditions.find((c) => c.id === id)!;
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
