
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  const reply = (statusCode, data) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
  });

  const apiKey = process.env.API_INDONESIA_KEY;
  if (!apiKey) {
    return reply(500, {
      error: "API key belum dipasang di Netlify."
    });
  }

  const q = event.queryStringParameters || {};
  const books = {
    "Kejadian":"Kej","Keluaran":"Kel","Imamat":"Im",
    "Bilangan":"Bil","Ulangan":"Ul","Mazmur":"Mzm",
    "Amsal":"Ams","Yesaya":"Yes","Matius":"Mat",
    "Markus":"Mrk","Lukas":"Luk","Yohanes":"Yoh",
    "Kisah Para Rasul":"Kis","Roma":"Rm",
    "1 Korintus":"1Kor","2 Korintus":"2Kor",
    "Galatia":"Gal","Efesus":"Ef","Filipi":"Flp",
    "Kolose":"Kol","Ibrani":"Ibr","Yakobus":"Yak",
    "Wahyu":"Why"
  };

  const book = books[q.book];
  const chapter = Number(q.chapter);
  const verse = Number(q.verse);

  if (!book || !Number.isInteger(chapter) || chapter < 1) {
    return reply(400, { error: "Referensi ayat tidak valid." });
  }

  try {
    const path = verse > 0
      ? `/verse/${book}/${chapter}/${verse}`
      : `/passage/${book}/${chapter}`;

    const response = await fetch(
      `https://use.apiindonesia.id/api/v1/alkitab${path}`,
      { headers: { "x-api-key": apiKey } }
    );

    const data = await response.json();

    if (!response.ok) {
      return reply(response.status, {
        error: "API Alkitab gagal mengambil teks."
      });
    }

    return reply(200, { data });
  } catch (error) {
    return reply(502, {
      error: "Gagal menghubungi layanan Alkitab."
    });
  }
};
