export function MessageInput({ value, onChange, onSend, disabled }) {
  return (
      <form onSubmit={onSend} style={{ display: "flex", gap: 8 }}>
          <input
              type="text"
              value={value}
              onChange={onChange}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "8px" }}
              disabled={disabled}
          />
          <button type="submit" style={{ padding: "8px 16px" }} disabled={disabled}>
              Send
          </button>
      </form>
  );
}
