// DOM Elements
const bookTitle = document.getElementById('bookTitle');
const bookAuthor = document.getElementById('bookAuthor');
const bookGenre = document.getElementById('bookGenre');
const bookPriority = document.getElementById('bookPriority');
const bookNotes = document.getElementById('bookNotes');
const addBookBtn = document.getElementById('addBookBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const booksList = document.getElementById('booksList');
const searchBooks = document.getElementById('searchBooks');
const filterGenre = document.getElementById('filterGenre');
const filterPriority = document.getElementById('filterPriority');
const viewCompletedBtn = document.getElementById('viewCompletedBtn');
const closeCompletedBtn = document.getElementById('closeCompletedBtn');
const completedSection = document.getElementById('completedSection');
const completedList = document.getElementById('completedList');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const bookModal = document.getElementById('bookModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');
const editBookBtn = document.getElementById('editBookBtn');
const completeBookBtn = document.getElementById('completeBookBtn');
const deleteBookBtn = document.getElementById('deleteBookBtn');

// Data storage
let books = JSON.parse(localStorage.getItem('readingList')) || [];
let completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
let currentBookId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadBooks();
    loadCompletedBooks();
});

function initializeApp() {
    // Form event listeners
    addBookBtn.addEventListener('click', addBook);
    clearFormBtn.addEventListener('click', clearForm);
    
    // Search and filter
    searchBooks.addEventListener('input', filterBooks);
    filterGenre.addEventListener('change', filterBooks);
    filterPriority.addEventListener('change', filterBooks);
    
    // Navigation
    viewCompletedBtn.addEventListener('click', toggleCompletedSection);
    closeCompletedBtn.addEventListener('click', toggleCompletedSection);
    
    // Modal
    closeModalBtn.addEventListener('click', closeModal);
    editBookBtn.addEventListener('click', editBook);
    completeBookBtn.addEventListener('click', markAsCompleted);
    deleteBookBtn.addEventListener('click', deleteBook);
    
    // Close modal when clicking outside
    bookModal.addEventListener('click', function(e) {
        if (e.target === bookModal) {
            closeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to add book
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            addBook();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            closeModal();
            toggleCompletedSection();
        }
    });
    
    // Form validation
    bookTitle.addEventListener('input', validateForm);
    bookAuthor.addEventListener('input', validateForm);
}

function validateForm() {
    const title = bookTitle.value.trim();
    addBookBtn.disabled = title.length === 0;
}

function addBook() {
    const title = bookTitle.value.trim();
    const author = bookAuthor.value.trim();
    const genre = bookGenre.value;
    const priority = bookPriority.value;
    const notes = bookNotes.value.trim();
    
    if (title.length === 0) {
        showToast('Please enter a book title');
        bookTitle.focus();
        return;
    }
    
    const book = {
        id: Date.now(),
        title: title,
        author: author,
        genre: genre,
        priority: priority,
        notes: notes,
        dateAdded: new Date().toISOString(),
        isCompleted: false
    };
    
    books.unshift(book);
    localStorage.setItem('readingList', JSON.stringify(books));
    
    showToast('Book added to reading list!');
    clearForm();
    loadBooks();
}

function clearForm() {
    bookTitle.value = '';
    bookAuthor.value = '';
    bookGenre.value = '';
    bookPriority.value = 'Medium';
    bookNotes.value = '';
    addBookBtn.disabled = true;
    bookTitle.focus();
}

function loadBooks() {
    booksList.innerHTML = '';
    
    if (books.length === 0) {
        booksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>Your reading list is empty</h3>
                <p>Start by adding your first book above!</p>
            </div>
        `;
        return;
    }
    
    books.forEach(book => {
        const bookElement = createBookElement(book);
        booksList.appendChild(bookElement);
    });
}

function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-item';
    bookDiv.onclick = () => openBookModal(book);
    
    const priorityClass = `priority-${book.priority.toLowerCase()}`;
    const genreIcon = getGenreIcon(book.genre);
    
    bookDiv.innerHTML = `
        <div class="book-icon">
            <i class="${genreIcon}"></i>
        </div>
        <div class="book-info">
            <div class="book-title">${escapeHtml(book.title)}</div>
            ${book.author ? `<div class="book-author">by ${escapeHtml(book.author)}</div>` : ''}
            <div class="book-meta">
                ${book.genre ? `<div class="book-genre"><i class="fas fa-tag"></i> ${escapeHtml(book.genre)}</div>` : ''}
                <div class="book-priority">
                    <span class="priority-badge ${priorityClass}">${book.priority}</span>
                </div>
                <div class="book-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(book.dateAdded)}
                </div>
            </div>
        </div>
        <div class="book-actions">
            <button class="book-action-btn complete" onclick="event.stopPropagation(); markAsCompleted(${book.id})">
                <i class="fas fa-check"></i>
            </button>
            <button class="book-action-btn" onclick="event.stopPropagation(); editBook(${book.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="book-action-btn delete" onclick="event.stopPropagation(); deleteBook(${book.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return bookDiv;
}

function getGenreIcon(genre) {
    const icons = {
        'Fiction': 'fas fa-magic',
        'Non-Fiction': 'fas fa-graduation-cap',
        'Science Fiction': 'fas fa-rocket',
        'Fantasy': 'fas fa-dragon',
        'Mystery': 'fas fa-search',
        'Thriller': 'fas fa-exclamation-triangle',
        'Romance': 'fas fa-heart',
        'Biography': 'fas fa-user',
        'Self-Help': 'fas fa-lightbulb',
        'Business': 'fas fa-briefcase',
        'Technology': 'fas fa-laptop-code',
        'History': 'fas fa-landmark',
        'Philosophy': 'fas fa-brain',
        'Other': 'fas fa-book'
    };
    return icons[genre] || 'fas fa-book';
}

function filterBooks() {
    const searchTerm = searchBooks.value.toLowerCase();
    const genreFilter = filterGenre.value;
    const priorityFilter = filterPriority.value;
    
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.notes.toLowerCase().includes(searchTerm);
        const matchesGenre = !genreFilter || book.genre === genreFilter;
        const matchesPriority = !priorityFilter || book.priority === priorityFilter;
        
        return matchesSearch && matchesGenre && matchesPriority;
    });
    
    displayFilteredBooks(filteredBooks);
}

function displayFilteredBooks(filteredBooks) {
    booksList.innerHTML = '';
    
    if (filteredBooks.length === 0) {
        booksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No books found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        booksList.appendChild(bookElement);
    });
}

function openBookModal(book) {
    currentBookId = book.id;
    modalTitle.textContent = book.title;
    
    const completedDate = book.completedDate ? formatDate(book.completedDate) : '';
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 16px;">
            <strong>Author:</strong> ${book.author || 'Unknown'}
        </div>
        ${book.genre ? `<div style="margin-bottom: 16px;"><strong>Genre:</strong> ${book.genre}</div>` : ''}
        <div style="margin-bottom: 16px;">
            <strong>Priority:</strong> 
            <span class="priority-badge priority-${book.priority.toLowerCase()}">${book.priority}</span>
        </div>
        <div style="margin-bottom: 16px;">
            <strong>Added:</strong> ${formatDate(book.dateAdded)}
        </div>
        ${completedDate ? `<div style="margin-bottom: 16px;"><strong>Completed:</strong> ${completedDate}</div>` : ''}
        ${book.notes ? `<div style="margin-bottom: 16px;"><strong>Notes:</strong><br>${escapeHtml(book.notes)}</div>` : ''}
    `;
    
    // Update button visibility
    if (book.isCompleted) {
        completeBookBtn.style.display = 'none';
        editBookBtn.style.display = 'none';
    } else {
        completeBookBtn.style.display = 'inline-flex';
        editBookBtn.style.display = 'inline-flex';
    }
    
    bookModal.classList.add('show');
}

function closeModal() {
    bookModal.classList.remove('show');
    currentBookId = null;
}

function editBook(bookId) {
    const book = bookId ? books.find(b => b.id === bookId) : books.find(b => b.id === currentBookId);
    if (!book) return;
    
    // Populate form with book data
    bookTitle.value = book.title;
    bookAuthor.value = book.author || '';
    bookGenre.value = book.genre || '';
    bookPriority.value = book.priority;
    bookNotes.value = book.notes || '';
    
    // Change button text and functionality
    addBookBtn.innerHTML = '<i class="fas fa-save"></i> Update Book';
    addBookBtn.onclick = updateBook;
    
    // Store the book ID for updating
    currentBookId = book.id;
    
    closeModal();
    showToast('Edit mode activated. Update the book details above.');
}

function updateBook() {
    const bookIndex = books.findIndex(b => b.id === currentBookId);
    if (bookIndex === -1) return;
    
    const title = bookTitle.value.trim();
    if (title.length === 0) {
        showToast('Please enter a book title');
        return;
    }
    
    books[bookIndex] = {
        ...books[bookIndex],
        title: title,
        author: bookAuthor.value.trim(),
        genre: bookGenre.value,
        priority: bookPriority.value,
        notes: bookNotes.value.trim()
    };
    
    localStorage.setItem('readingList', JSON.stringify(books));
    
    // Reset form and button
    clearForm();
    addBookBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Reading List';
    addBookBtn.onclick = addBook;
    currentBookId = null;
    
    showToast('Book updated successfully!');
    loadBooks();
}

function markAsCompleted(bookId) {
    const book = bookId ? books.find(b => b.id === bookId) : books.find(b => b.id === currentBookId);
    if (!book) return;
    
    if (confirm(`Mark "${book.title}" as completed?`)) {
        const completedBook = {
            ...book,
            isCompleted: true,
            completedDate: new Date().toISOString()
        };
        
        // Remove from reading list
        books = books.filter(b => b.id !== book.id);
        localStorage.setItem('readingList', JSON.stringify(books));
        
        // Add to completed books
        completedBooks.unshift(completedBook);
        localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
        
        showToast('Book marked as completed!');
        loadBooks();
        loadCompletedBooks();
        closeModal();
    }
}

function deleteBook(bookId) {
    const book = bookId ? books.find(b => b.id === bookId) : books.find(b => b.id === currentBookId);
    if (!book) return;
    
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
        books = books.filter(b => b.id !== book.id);
        localStorage.setItem('readingList', JSON.stringify(books));
        
        showToast('Book deleted');
        loadBooks();
        closeModal();
    }
}

function toggleCompletedSection() {
    const isVisible = completedSection.style.display !== 'none';
    completedSection.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        loadCompletedBooks();
    }
}

function loadCompletedBooks() {
    completedList.innerHTML = '';
    
    if (completedBooks.length === 0) {
        completedList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>No completed books yet</h3>
                <p>Start reading and mark books as completed!</p>
            </div>
        `;
        return;
    }
    
    completedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'completed-book-item';
        
        const genreIcon = getGenreIcon(book.genre);
        
        bookDiv.innerHTML = `
            <div class="book-icon">
                <i class="${genreIcon}"></i>
            </div>
            <div class="book-info">
                <div class="book-title">${escapeHtml(book.title)}</div>
                ${book.author ? `<div class="book-author">by ${escapeHtml(book.author)}</div>` : ''}
                <div class="book-meta">
                    <div class="book-date">
                        <i class="fas fa-calendar-check"></i>
                        Completed ${formatDate(book.completedDate)}
                    </div>
                </div>
            </div>
        `;
        
        completedList.appendChild(bookDiv);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functionality
function exportBooks() {
    const data = {
        readingList: books,
        completedBooks: completedBooks,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reading-list-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('Reading list exported successfully!');
}

// Import functionality
function importBooks(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.readingList) {
                books = [...books, ...data.readingList];
                localStorage.setItem('readingList', JSON.stringify(books));
            }
            
            if (data.completedBooks) {
                completedBooks = [...completedBooks, ...data.completedBooks];
                localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
            }
            
            loadBooks();
            loadCompletedBooks();
            showToast('Reading list imported successfully!');
        } catch (error) {
            showToast('Error importing reading list. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// Statistics
function getReadingStats() {
    const totalBooks = books.length + completedBooks.length;
    const completedCount = completedBooks.length;
    const readingCount = books.length;
    const completionRate = totalBooks > 0 ? Math.round((completedCount / totalBooks) * 100) : 0;
    
    return {
        total: totalBooks,
        completed: completedCount,
        reading: readingCount,
        completionRate: completionRate
    };
} 