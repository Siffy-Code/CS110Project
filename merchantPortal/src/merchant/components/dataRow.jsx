export default function DataRow({ title, subtext }) {

    return (
        <div className="data-row">

            <div className="data-row-left">
                <div className="data-row-title">
                    {title}
                </div>

                <div className="data-row-subtext">
                    {subtext}
                </div>
            </div>

        </div>
    );
}