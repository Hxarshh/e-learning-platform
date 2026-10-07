/**
 * Reusable Pagination Controls Component
 */
function renderPaginationControls(pageInfo, onPageChangeName) {
    const { page, totalPages, totalElements } = pageInfo;
    if (totalPages <= 1) return '';

    return `
        <div class="flex items-center justify-between" style="margin-top: var(--space-6); padding: var(--space-4) 0;">
            <span style="font-size: var(--font-size-sm); color: var(--text-muted);">
                Showing page <strong>${page + 1}</strong> of <strong>${totalPages}</strong> (${totalElements} items)
            </span>
            <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" ${page <= 0 ? 'disabled' : ''} onclick="${onPageChangeName}(${page - 1})">
                    &larr; Previous
                </button>
                <button class="btn btn-secondary btn-sm" ${page >= totalPages - 1 ? 'disabled' : ''} onclick="${onPageChangeName}(${page + 1})">
                    Next &rarr;
                </button>
            </div>
        </div>
    `;
}
