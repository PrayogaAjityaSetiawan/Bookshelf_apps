// Menunggu hingga halaman HTML selesai dimuat sebelum menjalankan kode JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const inputBook = document.getElementById('inputBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    // inisialisasi object untuk menyimpan daftar buku
    let books = [];

    // Memeriksa apakah ada data buku di localStorage
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }

    // menyimpan data buku ke localStorage
    function saveBooksToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    //  untuk menambahkan buku
    inputBook.addEventListener('submit', function (e) {
        e.preventDefault();

        // Mendapatkan nilai dari input user
        const inputBookTitle = document.getElementById('inputBookTitle').value;
        const inputBookAuthor = document.getElementById('inputBookAuthor').value;
        const inputBookYear = parseInt(document.getElementById('inputBookYear').value);
        const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

       // Membuat objek buku baru
        const book = {
            id : new Date().getTime(),
            title : inputBookTitle,
            author : inputBookAuthor,
            year: inputBookYear,
            isComplete : inputBookIsComplete
        };

        // Memasukkan buku ke daftar dan menyimpan ke localStorage
        books.push(book);
        saveBooksToLocalStorage();
        // Mengapdate tampilan rak buku
        updateBookshelf();

        // Merefresh input form setelah menambahkan buku
        document.getElementById('inputBookTitle').value = '';
        document.getElementById('inputBookAuthor').value = '';
        document.getElementById('inputBookYear').value = '';
        document.getElementById('inputBookIsComplete').checked = false;
}
            
    );

    // untuk memperbarui tampilan rak buku
    function updateBookshelf() {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        for (const book of books) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        }
    }

    // Fungsi untuk menghapus buku berdasarkan ID
    function removeBook(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books.splice(index, 1);
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    }

    //  untuk mengganti status selesai atau belum selesai membaca buku
    function toggleIsComplete(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].isComplete = !books[index].isComplete;
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    }


    // Fungsi pencarian Buku 
    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchTerm = document.getElementById('searchBookTitle').value;
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';
        for (const book of filteredBooks) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        }
    })

    // Fungsi untuk membuat elemen buku dalam daftar
    function createBookItem(book) {
        const bookItem = document.createElement('article');
        bookItem.className = 'book_item';
        bookItem.style.padding = '10px';
        bookItem.style.margin= '5px 10px'
        bookItem.style.backgroundColor= '#0C2D57'
        bookItem.style.color= 'white'
        bookItem.style.textTransform ='capitalize'
        bookItem.style.borderRadius ='20px'

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action';

        const title = document.createElement('h3');
        title.textContent = 'Judul: ' + book.title;

        const author = document.createElement('p');
        author.textContent = 'Penulis: ' + book.author;
        author.style.margin = '10px 0';

        const year = document.createElement('p');
        year.textContent = 'Tahun: ' + book.year;
        year.style.marginBottom = '10px';

        const removeButton = createActionButton('Hapus buku', 'hapus', function () {
            removeBook(book.id);
        });

        let toggleButton;
        if (book.isComplete) {
            toggleButton = createActionButton('Belum selesai di Baca', 'belum', function () {
                toggleIsComplete(book.id);
            });
        } else {
            toggleButton = createActionButton('Selesai dibaca', 'selesai', function () {
                toggleIsComplete(book.id);
            });
        }

        // Styling button Hapus
        removeButton.style.padding = '10px';
        removeButton.style.margin = '10px';
        removeButton.style.borderRadius = '10px';
        removeButton.style.border = 'none';
        removeButton.style.backgroundColor = '#FC6736';
        removeButton.style.color = 'white';
        removeButton.style.fontWeight = 'bold';

        // Styling button
        toggleButton.style.padding = '10px';
        toggleButton.style.borderRadius = '10px';
        toggleButton.style.border = 'none';
        toggleButton.style.backgroundColor = '#FC6736';
        toggleButton.style.color = 'white';
        toggleButton.style.fontWeight = 'bold';

        actionButtons.appendChild(toggleButton);
        actionButtons.appendChild(removeButton);

        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(actionButtons);

        return bookItem;
    }

    // Fungsi untuk membuat elemen tombol
    function createActionButton(text, className, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener('click', clickHandler);
        return button;
    }

    // Memperbarui tampilan 
    updateBookshelf();
});
