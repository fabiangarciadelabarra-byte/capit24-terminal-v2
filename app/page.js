      {/* BUSCADOR */}
      <div style={{ marginTop: "30px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar BTC, ETH, SOL..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            search(e.target.value);
          }}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #333",
            background: "#111",
            color: "white",
          }}
        />

        {/* RESULTADOS DEL BUSCADOR */}
        {query.length > 1 && (
          <div
            style={{
              background: "#111",
              border: "1px solid #333",
              marginTop: "5px",
              borderRadius: "6px",
              padding: "10px",
            }}
          >
            {searchLoading ? (
              <p>Buscando...</p>
            ) : results.length === 0 ? (
              <p>No se encontraron resultados</p>
            ) : (
              results.map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => {
                    setSelectedSymbol(coin.symbol + "USDT");
                    setQuery("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  <img src={coin.image} width={24} height={24} />
                  <span>
                    {coin.name} ({coin.symbol})
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ⭐ WATCHLIST BAR (FAVORITOS) */}
      <WatchlistBar watchlist={watchlist} onSelect={setSelectedSymbol} />

      {/* PANEL DE MERCADO */}
      <h2 style={{ marginTop: "40px" }}>Market Overview</h2>
