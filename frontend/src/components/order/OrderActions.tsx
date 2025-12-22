interface Props {
    loading: boolean;
    error: string | null;
    orderId: string | null;
    onCreate: () => void;
  }
  
  export default function OrderActions({
    loading,
    error,
    orderId,
    onCreate,
  }: Props) {
    return (
      <>
        <button onClick={onCreate} disabled={loading}>
          {loading ? "Creating order..." : "Create Order"}
        </button>
  
        {error && <p className="error">{error}</p>}
  
        {orderId && (
          <div style={{ marginTop: 16 }}>
            <p className="success">
              ✅ Order created successfully
            </p>
            <button
              onClick={() =>
                window.open(
                  `http://localhost:3001/orders/${orderId}/pdf`,
                  "_blank"
                )
              }
            >
              Download Production Sheet (PDF)
            </button>
          </div>
        )}
      </>
    );
  }
  