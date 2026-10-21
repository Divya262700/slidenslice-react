export default function Confirm({ text, yes = 'Yes', onYes, onNo }) {
  return (
    <div className="overlay" onClick={onNo}>
      <div className="modal small" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-text">{text}</p>
        <div className="row end">
          <button className="btn ghost" onClick={onNo}>Cancel</button>
          <button className="btn danger" onClick={onYes}>{yes}</button>
        </div>
      </div>
    </div>
  );
}
