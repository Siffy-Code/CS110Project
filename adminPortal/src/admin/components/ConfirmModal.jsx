export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    danger = false,
    onConfirm,
    onClose,
}) {
    if (!open) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>

                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>

                <div className="modal-actions">
                    <button className="secondary-button" onClick={onClose}>
                        {cancelLabel}
                    </button>
                    <button
                        className={`primary-button ${danger ? "danger" : ""}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>

            </div>
        </div>
    );
}
