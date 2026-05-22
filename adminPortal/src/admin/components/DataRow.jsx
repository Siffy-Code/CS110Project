export default function DataRow({ title, subtext, badge, actions }) {
    return (
        <div className="data-row">

            <div className="data-row-left">
                <div className="data-row-title">
                    {title}
                    {badge ? (
                        <span className={`badge ${badge.tone || ""}`}>
                            {badge.label}
                        </span>
                    ) : null}
                </div>

                <div className="data-row-subtext">
                    {subtext}
                </div>
            </div>

            {actions ? <div className="data-row-actions">{actions}</div> : null}

        </div>
    );
}
