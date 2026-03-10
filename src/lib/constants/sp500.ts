/**
 * S&P 500 tickers for validation (abbreviated list of major constituents)
 * Full list would be 503 entries; this covers common stocks for MVP
 */
export const SP500_TICKERS = new Set([
  "A","AAL","AAP","AAPL","ABBV","ABC","ABMD","ABT","ACN","ADBE",
  "ADI","ADM","ADP","ADSK","AEE","AEP","AES","AFL","AIG","AIZ",
  "AJG","AKAM","ALB","ALGN","ALK","ALL","ALLE","AMAT","AMCR","AMD",
  "AME","AMGN","AMP","AMT","AMZN","ANET","ANSS","AON","AOS","APA",
  "APD","APH","APTV","ARE","ATO","AVB","AVGO","AVY","AWK","AXP",
  "AZO","BA","BAC","BALL","BAX","BBWI","BBY","BDX","BEN","BIO",
  "BIIB","BK","BKNG","BKR","BLK","BMY","BR","BRK.B","BRO","BSX",
  "BWA","BXP","C","CAG","CAH","CARR","CAT","CB","CBOE","CBRE",
  "CCI","CCL","CDNS","CDW","CE","CEG","CF","CFG","CHD","CHRW",
  "CHTR","CI","CINF","CL","CLX","CMA","CMCSA","CME","CMG","CMI",
  "CMS","CNC","CNP","COF","COO","COP","COST","CPB","CPRT","CPT",
  "CRL","CRM","CSCO","CSX","CTAS","CTLT","CTSH","CTVA","CVS","CVX",
  "CZR","D","DAL","DD","DE","DFS","DG","DGX","DHI","DHR","DIS",
  "DISH","DLR","DLTR","DOV","DOW","DPZ","DRE","DRI","DTE","DUK",
  "DVA","DVN","DXC","DXCM","EA","EBAY","ECL","ED","EFX","EIX",
  "EL","EMN","EMR","ENPH","EOG","EPAM","EQIX","EQR","ES","ESS",
  "ETN","ETR","ETSY","EVRG","EW","EXC","EXPD","EXPE","EXR","F",
  "FANG","FAST","FCX","FDS","FDX","FE","FFIV","FIS","FISV","FITB",
  "FLT","FMC","FND","FOX","FOXA","FRC","FRT","FTI","FTNT","FTV",
  "GD","GE","GILD","GIS","GL","GLW","GM","GNRC","GOOGL","GPC",
  "GPN","GPS","GRMN","GS","GWW","HAL","HAS","HBAN","HCA","HD",
  "HES","HIG","HII","HLT","HOLX","HON","HPE","HPQ","HRL","HSIC",
  "HST","HSY","HUM","HWM","IBM","ICE","IDXX","IEX","IFF","ILMN",
  "INCY","INTC","INTU","INVH","IP","IPG","IQV","IR","IRM","ISRG",
  "IT","ITW","IVZ","J","JBHT","JCI","JKHY","JNJ","JNPR","JPM",
  "K","KEY","KEYS","KHC","KIM","KLAC","KMB","KMI","KMX","KO",
  "KR","L","LDOS","LEN","LH","LHX","LIN","LKQ","LLY","LMT",
  "LNC","LNT","LOW","LRCX","LUMN","LUV","LVS","LW","LYB","LYV",
  "MA","MAA","MAR","MAS","MCD","MCHP","MCK","MCO","MDLZ","MDT",
  "MET","META","MGM","MHK","MKC","MKTX","MLM","MMC","MMM","MNST",
  "MO","MOH","MOS","MPC","MPWR","MRK","MRNA","MRO","MS","MSCI",
  "MSFT","MSI","MTB","MTCH","MTD","MU","NCLH","NDAQ","NEE","NEM",
  "NFLX","NI","NKE","NOC","NOW","NRG","NSC","NTAP","NTRS","NUE",
  "NVDA","NVR","NWL","NWS","NWSA","NXPI","O","ODFL","OGN","OKE",
  "OMC","ON","ORCL","ORLY","OXY","PAYC","PAYX","PCAR","PCG","PEG",
  "PEP","PFE","PFG","PG","PGR","PH","PHM","PKG","PKI","PLD",
  "PM","PNC","PNR","PNW","POOL","PPG","PPL","PRU","PSA","PSX",
  "PTC","PVH","PWR","PXD","PYPL","QCOM","QRVO","RCL","RE","REG",
  "REGN","RF","RHI","RJF","RL","RMD","ROK","ROL","ROP","ROST",
  "RRC","RSG","RTX","SBAC","SBUX","SEDG","SEE","SHW","SIVB","SJM",
  "SLB","SNA","SNPS","SO","SPG","SPGI","SRE","STE","STT","STX",
  "STZ","SWK","SWKS","SYF","SYK","SYY","T","TAP","TDG","TDY",
  "TECH","TEL","TER","TFC","TFX","TGT","TJX","TMO","TMUS","TPR",
  "TRMB","TROW","TRV","TSCO","TSLA","TSN","TT","TTWO","TXN","TXT",
  "TYL","UA","UAA","UAL","UDR","UHS","ULTA","UNH","UNP","UPS",
  "URI","USB","V","VFC","VLO","VMC","VNO","VRSK","VRSN","VRTX",
  "VTR","VTRS","VZ","WAB","WAT","WBA","WBD","WDC","WEC","WELL",
  "WFC","WHR","WM","WMB","WMT","WRB","WRK","WY","WYNN","XEL",
  "XOM","XRAY","XYL","YUM","ZBH","ZBRA","ZION","ZTS","GOOG","BRK-B",
  // Add common ETFs and extras
  "SPY","QQQ","DIA","IWM","VTI","VOO","ARKK","GLD","SLV"
]);

export function isValidTicker(ticker: string): boolean {
  return SP500_TICKERS.has(ticker.toUpperCase());
}

export function normalizeTicker(ticker: string): string {
  return ticker.toUpperCase().trim();
}
