export function ActionButtons({ numberOfActions, disabled, onPlay }) {
  return (
      <div style={{ marginTop: 16 }}>
          <h4>{disabled ? "Actions (Waiting for others...)" : "Actions"}</h4>
          <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: numberOfActions }).map((_, index) => (
                  <button
                      key={index}
                      onClick={() => onPlay(index)}
                      disabled={disabled}
                      style={{
                          opacity: disabled ? 0.5 : 1,
                          cursor: disabled ? "not-allowed" : "pointer",
                      }}
                  >
                      Action {index + 1}
                  </button>
              ))}
          </div>
      </div>
  );
}
