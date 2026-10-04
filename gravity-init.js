// Gravity - Final initialization

document.addEventListener("DOMContentLoaded", () => {

    // تحديث إحصائيات لوحة M11 بعد تحميل books.js
    if (typeof updateStats === "function") {
        updateStats();
    }

    // تحديث قائمة الكتب المحلية إذا كانت موجودة
    if (typeof renderLocalBooks === "function") {
        renderLocalBooks();
    }

});
