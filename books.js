const gravityBooks = [

    // =========================
    // ENGLISH CLASSICS
    // =========================

    {
        title: "Alice’s Adventures in Wonderland",
        author: "Lewis Carroll",
        category: "روايات",
        language: "English",
        description: "رواية كلاسيكية شهيرة تأخذ أليس إلى عالم غريب مليء بالمغامرات والشخصيات الخيالية.",
        url: "https://www.gutenberg.org/ebooks/11"
    },

    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "روايات",
        language: "English",
        description: "واحدة من أشهر الروايات الكلاسيكية في الأدب الإنجليزي.",
        url: "https://www.gutenberg.org/ebooks/1342"
    },

    {
        title: "The Adventures of Sherlock Holmes",
        author: "Arthur Conan Doyle",
        category: "روايات",
        language: "English",
        description: "مجموعة من أشهر مغامرات المحقق شيرلوك هولمز.",
        url: "https://www.gutenberg.org/ebooks/1661"
    },

    {
        title: "A Tale of Two Cities",
        author: "Charles Dickens",
        category: "روايات",
        language: "English",
        description: "رواية كلاسيكية تدور أحداثها بين لندن وباريس خلال فترة الثورة الفرنسية.",
        url: "https://www.gutenberg.org/ebooks/98"
    },


    // =========================
    // ARABIC BOOKS
    // =========================

    {
        title: "زينب",
        author: "محمد حسين هيكل",
        category: "روايات عربية",
        language: "العربية",
        description: "من أشهر الأعمال المبكرة في الرواية العربية الحديثة، ومتاحة قانونيًا عبر صفحات.",
        url: "https://www.safahat.org/books/28493759/"
    },

    {
        title: "أزهار الشوك",
        author: "محمد فريد أبو حديد",
        category: "أدب عربي",
        language: "العربية",
        description: "عمل أدبي من التراث العربي الحديث، والنص يقع في نطاق الملكية العامة.",
        url: "https://www.safahat.org/books/60929519/"
    },

    {
        title: "صباح الورد",
        author: "نجيب محفوظ",
        category: "روايات عربية",
        language: "العربية",
        description: "ثلاث قصص قصيرة تعود فيها الحكايات إلى ذكريات نجيب محفوظ وأجواء القاهرة القديمة.",
        url: "https://www.safahat.org/books/17908281/"
    },

    {
        title: "ثرثرة فوق النيل",
        author: "نجيب محفوظ",
        category: "روايات عربية",
        language: "العربية",
        description: "رواية أدبية تناقش الحياة والوجود من خلال مجموعة من الشخصيات.",
        url: "https://www.safahat.org/books/96941592/"
    },

    {
        title: "زقاق المدق",
        author: "نجيب محفوظ",
        category: "روايات عربية",
        language: "العربية",
        description: "رواية تدور في أحد أحياء القاهرة القديمة وتقدم عالمًا غنيًا بالشخصيات والأحداث.",
        url: "https://www.safahat.org/books/62575295/"
    },

    {
        title: "جنة الشوك",
        author: "طه حسين",
        category: "أدب عربي",
        language: "العربية",
        description: "عمل أدبي من أعمال عميد الأدب العربي طه حسين، متاح مجانًا عبر صفحات.",
        url: "https://www.safahat.org/books/96918483/"
    },

    {
        title: "هارب من الأيام",
        author: "ثروت أباظة",
        category: "روايات عربية",
        language: "العربية",
        description: "رواية مصرية من الأدب العربي الحديث، متاحة مجانًا عبر صفحات باتفاق قانوني.",
        url: "https://www.safahat.org/books/46851305/"
    },

    {
        title: "شيء من الخوف",
        author: "ثروت أباظة",
        category: "روايات عربية",
        language: "العربية",
        description: "من كلاسيكيات الرواية العربية، وتتناول الخوف والاستبداد في المجتمع الريفي.",
        url: "https://www.safahat.org/books/68680686/"
    }

];


// ======================================
// GET ALL BOOKS
// ======================================

function getGravityBooks() {

    const localBooks =
        JSON.parse(localStorage.getItem("gravity_m11_books")) || [];

    return [
        ...gravityBooks,
        ...localBooks
    ];
}


// ======================================
// SEARCH
// ======================================

function searchGravityBooks(query) {

    const text = query
        .trim()
        .toLowerCase();

    if (!text) {
        return getGravityBooks();
    }

    return getGravityBooks().filter(book => {

        return (
            book.title.toLowerCase().includes(text) ||
            book.author.toLowerCase().includes(text) ||
            book.category.toLowerCase().includes(text) ||
            book.language.toLowerCase().includes(text)
        );

    });
}


// ======================================
// CATEGORY
// ======================================

function getGravityBooksByCategory(category) {

    if (category === "الكل") {
        return getGravityBooks();
    }

    return getGravityBooks().filter(
        book => book.category === category
    );
}


// ======================================
// OPEN BOOK
// ======================================

function openGravityBook(book) {

    const params = new URLSearchParams({

        title: book.title,

        author: book.author,

        category: book.category,

        description: book.description,

        url: book.url

    });

    window.location.href =
        "book.html?" + params.toString();
          }
