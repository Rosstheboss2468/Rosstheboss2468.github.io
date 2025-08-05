// DOM Elements
const messageTextarea = document.getElementById('messageTextarea');
const charCount = document.getElementById('charCount');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const postBtn = document.getElementById('postBtn');
const viewDraftsBtn = document.getElementById('viewDraftsBtn');
const closeDraftsBtn = document.getElementById('closeDraftsBtn');
const draftsSection = document.getElementById('draftsSection');
const draftsList = document.getElementById('draftsList');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Drafts storage
let drafts = JSON.parse(localStorage.getItem('linkedinDrafts')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadDrafts();
});

function initializeApp() {
    // Character count functionality
    messageTextarea.addEventListener('input', updateCharacterCount);
    
    // Button event listeners
    saveDraftBtn.addEventListener('click', saveDraft);
    postBtn.addEventListener('click', handlePost);
    viewDraftsBtn.addEventListener('click', toggleDraftsSection);
    closeDraftsBtn.addEventListener('click', toggleDraftsSection);
    
    // Action buttons (for future functionality)
    document.getElementById('addMediaBtn').addEventListener('click', () => showToast('Media upload feature coming soon!'));
    document.getElementById('addDocumentBtn').addEventListener('click', () => showToast('Document upload feature coming soon!'));
    document.getElementById('addEventBtn').addEventListener('click', () => showToast('Event creation feature coming soon!'));
    document.getElementById('addPollBtn').addEventListener('click', () => showToast('Poll creation feature coming soon!'));
    
    // Auto-save functionality
    let autoSaveTimeout;
    messageTextarea.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            if (messageTextarea.value.trim().length > 0) {
                autoSaveDraft();
            }
        }, 3000); // Auto-save after 3 seconds of inactivity
    });
}

function updateCharacterCount() {
    const count = messageTextarea.value.length;
    charCount.textContent = count;
    
    // Update post button state
    postBtn.disabled = count === 0;
    
    // Visual feedback for character limit
    if (count > 2800) {
        charCount.style.color = '#d11124';
    } else if (count > 2500) {
        charCount.style.color = '#ff8c00';
    } else {
        charCount.style.color = '#666666';
    }
}

function saveDraft() {
    const content = messageTextarea.value.trim();
    
    if (content.length === 0) {
        showToast('Please enter some content to save as draft');
        return;
    }
    
    const draft = {
        id: Date.now(),
        content: content,
        timestamp: new Date().toISOString(),
        characterCount: content.length
    };
    
    drafts.unshift(draft); // Add to beginning of array
    localStorage.setItem('linkedinDrafts', JSON.stringify(drafts));
    
    showToast('Draft saved successfully!');
    loadDrafts(); // Refresh drafts list
    
    // Clear the textarea
    messageTextarea.value = '';
    updateCharacterCount();
}

function autoSaveDraft() {
    const content = messageTextarea.value.trim();
    
    if (content.length === 0) return;
    
    // Check if this content is already saved as a draft
    const existingDraft = drafts.find(draft => draft.content === content);
    if (existingDraft) return;
    
    const draft = {
        id: Date.now(),
        content: content,
        timestamp: new Date().toISOString(),
        characterCount: content.length,
        isAutoSaved: true
    };
    
    drafts.unshift(draft);
    localStorage.setItem('linkedinDrafts', JSON.stringify(drafts));
    
    // Don't show toast for auto-save to avoid spam
    loadDrafts();
}

function handlePost() {
    const content = messageTextarea.value.trim();
    
    if (content.length === 0) {
        showToast('Please enter some content to post');
        return;
    }
    
    // Simulate posting (in a real app, this would send to LinkedIn API)
    showToast('Post would be published to LinkedIn! (This is a demo)');
    
    // Clear the textarea
    messageTextarea.value = '';
    updateCharacterCount();
}

function toggleDraftsSection() {
    const isVisible = draftsSection.style.display !== 'none';
    draftsSection.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        loadDrafts(); // Refresh drafts when showing
    }
}

function loadDrafts() {
    draftsList.innerHTML = '';
    
    if (drafts.length === 0) {
        draftsList.innerHTML = `
            <div class="draft-item">
                <div class="draft-content" style="text-align: center; color: #666666; font-style: italic;">
                    No drafts saved yet. Start writing to save your first draft!
                </div>
            </div>
        `;
        return;
    }
    
    drafts.forEach(draft => {
        const draftElement = createDraftElement(draft);
        draftsList.appendChild(draftElement);
    });
}

function createDraftElement(draft) {
    const draftDiv = document.createElement('div');
    draftDiv.className = 'draft-item';
    
    const formattedDate = new Date(draft.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const contentPreview = draft.content.length > 150 
        ? draft.content.substring(0, 150) + '...' 
        : draft.content;
    
    draftDiv.innerHTML = `
        <div class="draft-content">${escapeHtml(contentPreview)}</div>
        <div class="draft-meta">
            <span>${formattedDate} • ${draft.characterCount} characters</span>
            <div class="draft-actions">
                <button class="draft-action-btn" onclick="loadDraft(${draft.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="draft-action-btn delete" onclick="deleteDraft(${draft.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return draftDiv;
}

function loadDraft(draftId) {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
        messageTextarea.value = draft.content;
        updateCharacterCount();
        toggleDraftsSection(); // Close drafts section
        showToast('Draft loaded!');
    }
}

function deleteDraft(draftId) {
    if (confirm('Are you sure you want to delete this draft?')) {
        drafts = drafts.filter(d => d.id !== draftId);
        localStorage.setItem('linkedinDrafts', JSON.stringify(drafts));
        loadDrafts();
        showToast('Draft deleted');
    }
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save draft
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDraft();
    }
    
    // Ctrl/Cmd + Enter to post
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!postBtn.disabled) {
            handlePost();
        }
    }
    
    // Escape to close drafts section
    if (e.key === 'Escape' && draftsSection.style.display !== 'none') {
        toggleDraftsSection();
    }
});

// Focus management
messageTextarea.addEventListener('focus', function() {
    this.parentElement.style.borderColor = '#0a66c2';
});

messageTextarea.addEventListener('blur', function() {
    this.parentElement.style.borderColor = '#e0e0e0';
});

// Export functionality (for future use)
function exportDrafts() {
    const dataStr = JSON.stringify(drafts, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'linkedin-drafts.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import functionality (for future use)
function importDrafts(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedDrafts = JSON.parse(e.target.result);
            drafts = [...drafts, ...importedDrafts];
            localStorage.setItem('linkedinDrafts', JSON.stringify(drafts));
            loadDrafts();
            showToast('Drafts imported successfully!');
        } catch (error) {
            showToast('Error importing drafts. Please check the file format.');
        }
    };
    reader.readAsText(file);
} 