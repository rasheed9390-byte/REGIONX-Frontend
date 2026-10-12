import { useEffect, useMemo, useState } from "react";

import {

  Activity,

  ArrowRight,

  CheckCircle2,

  Code2,

  Database,

  BarChart3,

  Check,

  ChevronDown,

  Cloud,

  Clock3,

  Globe2,

  History,

  Info,

  MapPin,

  Moon,

  Network,

  Play,

  RefreshCw,

  Server,

  Trophy,

  Zap,

} from "lucide-react";

import {

  ComposableMap,

  Geographies,

  Geography,

  Line,

  Marker,

} from "react-simple-maps";

import "./index.css";

const GEO_URL =

  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Status = "EXCELLENT" | "GOOD" | "AVERAGE" | "HIGH";

type Region = {

  name: string;

  aws: string;

  country: string;

  flag: string;

  latency: number | null;

  status: Status;

  coordinates: [number, number];

};

const initialRegions: Region[] = [

  {

    name: "Mumbai",

    aws: "ap-south-1",

    country: "in",

    flag: "🇮🇳",

    latency: 24,

    status: "EXCELLENT",

    coordinates: [72.8777, 19.076],

  },

  {

    name: "Singapore",

    aws: "ap-southeast-1",

    country: "sg",

    flag: "🇸🇬",

    latency: 58,

    status: "GOOD",

    coordinates: [103.8198, 1.3521],

  },

  {

    name: "Frankfurt",

    aws: "eu-central-1",

    country: "de",

    flag: "🇩🇪",

    latency: 142,

    status: "AVERAGE",

    coordinates: [8.6821, 50.1109],

  },

  {

    name: "US East",

    aws: "us-east-1",

    country: "us",

    flag: "🇺🇸",

    latency: 218,

    status: "HIGH",

    coordinates: [-74.006, 40.7128],

  },

];

const getStatus = (latency: number): Status => {

  if (latency < 50) return "EXCELLENT";

  if (latency < 100) return "GOOD";

  if (latency <= 150) return "AVERAGE";

  return "HIGH";

};

function Flag({

  country,

  fallback,

}: {

  country: string;

  fallback: string;

}) {

  return (

    <img

      className="flag"

      src={`https://flagcdn.com/w40/${country}.png`}

      alt={fallback}

    />

  );

}

function Sidebar({

  active,

  setActive,

}: {

  active: string;

  setActive: (value: string) => void;

}) {

  const items = [

    ["Dashboard", Activity],

    ["Latency Test", Zap],

    ["History", History],

    ["Architecture", Network],

    ["About", Info],

  ] as const;

  return (

    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">

          <Cloud size={34} />

        </div>

        <div>

          <div className="brand-name">REGIONX</div>

          <div className="brand-sub">

            CLOUD REGION LATENCY

            <br />

            COMPARATOR

          </div>

        </div>

      </div>

      <div className="menu-label">MAIN MENU</div>

      <nav>

        {items.map(([label, Icon]) => (

          <button

            key={label}

            className={`nav-item ${active === label ? "active" : ""}`}

            onClick={() => setActive(label)}

          >

            <Icon size={20} />

            <span>{label}</span>

          </button>

        ))}

      </nav>

      <div className="sidebar-bottom">

        <div className="online-card">

          <div className="online-icon">

            <Activity size={17} />

          </div>

          <div>

            <strong>System Online</strong>

            <span>All services operational</span>

          </div>

          <i />

        </div>

        <div className="version">

          REGIONX v1.0.0&nbsp;&nbsp;•&nbsp;&nbsp; Cloud Intelligence

        </div>

      </div>

    </aside>

  );

}

function Header() {

  return (

    <header className="header">

      <div>

        <h1>

          Find Your <span>Fastest Cloud Region</span>

        </h1>

        <p>

          Measure latency across global cloud regions and identify the

          optimal deployment region.

        </p>

      </div>

      <div className="header-actions">

        <div className="location">

          <MapPin size={20} />

          <div>

            <small>YOUR LOCATION</small>

            <strong>India • Telangana</strong>

          </div>

        </div>

        <button className="icon-button">

          <Moon size={19} />

        </button>

        <button className="profile">

          <div className="avatar">AR</div>

          <div>

            <strong>Admin</strong>

            <small>Developer</small>

          </div>

          <ChevronDown size={14} />

        </button>

      </div>

    </header>

  );

}

function RegionSelector({

  regions,

  selected,

  toggle,

  onStart,

}: {

  regions: Region[];

  selected: string[];

  toggle: (aws: string) => void;

  onStart: () => void;

}) {

  return (

    <section className="selector">

      <div className="selector-heading">

        <div>

          <h2>Select Regions to Test</h2>

          <p>Choose cloud regions to compare network performance</p>

        </div>

        <span className="selected-count">

          <Check size={13} />

          {selected.length} selected

        </span>

      </div>

      <div className="selector-row">

        {regions.map((region) => {

          const isSelected = selected.includes(region.aws);

          return (

            <button

              key={region.aws}

              className="region-select"

              onClick={() => toggle(region.aws)}

            >

              <span className={`checkbox ${isSelected ? "checked" : ""}`}>

                {isSelected && <Check size={12} />}

              </span>

              <Flag

                country={region.country}

                fallback={region.flag}

              />

              <span className="region-select-text">

                <strong>{region.name}</strong>

                <small>{region.aws}</small>

              </span>

            </button>

          );

        })}

        <button className="start-button" onClick={onStart}>

          <Play size={17} fill="white" />

          Start Latency Test

        </button>

      </div>

    </section>

  );

}

function Node({

  region,

  color,

  left,

}: {

  region: Region;

  color: string;

  left?: boolean;

}) {

  return (

    <Marker coordinates={region.coordinates}>

      <g className={`map-node ${color}`}>

        <circle r="13" className="node-glow" />

        <circle r="8" className="node-ring" />

        <circle r="4" className="node-dot" />

        <g

          transform={

            left

              ? "translate(-116,-22)"

              : "translate(13,-22)"

          }

        >

          <rect width="108" height="42" rx="6" />

          <text x="10" y="17" className="node-name">

            {region.name}

          </text>

          <text x="10" y="32" className="node-ms">

            {region.latency} ms

          </text>

        </g>

      </g>

    </Marker>

  );

}

function NetworkMap({ regions }: { regions: Region[] }) {

  const get = (aws: string) =>

    regions.find((region) => region.aws === aws);

  const mumbai = get("ap-south-1");

  const singapore = get("ap-southeast-1");

  const frankfurt = get("eu-central-1");

  const usEast = get("us-east-1");

  return (

    <section className="network-panel">

      <div className="panel-top">

        <div>

          <div className="panel-title">

            <Globe2 size={19} />

            <h2>GLOBAL CLOUD NETWORK</h2>

          </div>

          <p>Real-time latency testing across multiple AWS regions</p>

        </div>

        <span className="live">

          <i />

          LIVE NETWORK

        </span>

      </div>

      <div className="map">

        <div className="map-background" />

        <ComposableMap

          width={1000}

          height={420}

          projection="geoEqualEarth"

          projectionConfig={{

            scale: 155,

            center: [10, 4],

          }}

        >

          <Geographies geography={GEO_URL}>

            {({ geographies }) =>

              geographies.map((geo) => (

                <Geography

                  key={geo.rsmKey}

                  geography={geo}

                  className="country-shape"

                />

              ))

            }

          </Geographies>

          {usEast && frankfurt && (

            <Line

              from={usEast.coordinates}

              to={frankfurt.coordinates}

              className="route"

            />

          )}

          {frankfurt && mumbai && (

            <Line

              from={frankfurt.coordinates}

              to={mumbai.coordinates}

              className="route"

            />

          )}

          {mumbai && singapore && (

            <Line

              from={mumbai.coordinates}

              to={singapore.coordinates}

              className="route"

            />

          )}

          {usEast && mumbai && (

            <Line

              from={usEast.coordinates}

              to={mumbai.coordinates}

              className="route secondary"

            />

          )}

          {usEast && (

            <Node

              region={usEast}

              color="red"

            />

          )}

          {frankfurt && (

            <Node

              region={frankfurt}

              color="yellow"

            />

          )}

          {mumbai && (

            <Node

              region={mumbai}

              color="green"

            />

          )}

          {singapore && (

            <Node

              region={singapore}

              color="green"

              left

            />

          )}

        </ComposableMap>

      </div>

      <div className="map-footer">

        <div className="legend">

          <span>

            <i className="green" />

            Excellent <b>&lt; 50 ms</b>

          </span>

          <span>

            <i className="yellow" />

            Average <b>50–150 ms</b>

          </span>

          <span>

            <i className="red" />

            High <b>&gt; 150 ms</b>

          </span>

        </div>

        <span className="connected">

          <i />

          {regions.length} regions connected

        </span>

      </div>

    </section>

  );

}

function BestRegion({ region }: { region?: Region }) {

  if (!region) return null;

  return (

    <section className="best-panel">

      <div className="best-title">

        <Trophy size={25} />

        <h2>BEST REGION</h2>

      </div>

      <div className="best-card">

        <div className="best-info">

          <Flag

            country={region.country}

            fallback={region.flag}

          />

          <div>

            <h3>AWS {region.name}</h3>

            <span>{region.aws}</span>

          </div>

        </div>

        <div className="best-latency">

          {region.latency}

          <small>ms</small>

        </div>

        <span className="best-status">

          {region.status}

        </span>

        <Cloud className="best-cloud" size={48} />

      </div>

      <div className="recommendation">

        <div />

        <section>

          <h3>Recommended for your location</h3>

          <p>

            Lowest latency and best performance

            <br />

            for your region.

          </p>

        </section>

      </div>

    </section>

  );

}

function Sparkline({ color }: { color: string }) {

  return (

    <svg className={`spark ${color}`} viewBox="0 0 100 35">

      <path d="M2 28 L12 25 L22 27 L32 18 L42 23 L52 15 L62 20 L72 10 L82 14 L98 3" />

    </svg>

  );

}

function LatencyCard({ region }: { region: Region }) {

  const color =

    region.status === "HIGH"

      ? "red"

      : region.status === "AVERAGE"

        ? "yellow"

        : "green";

  return (

    <div className={`latency-card ${color}`}>

      <div className="latency-top">

        <Flag

          country={region.country}

          fallback={region.flag}

        />

        <div>

          <strong>AWS {region.name}</strong>

          <small>{region.aws}</small>

        </div>

      </div>

      <div className="latency-middle">

        <strong>

          {region.latency ?? "—"}

          {region.latency !== null && <small> ms</small>}

        </strong>

        <Sparkline color={color} />

      </div>

      <div className="latency-bottom">

        <span>{region.status}</span>

        <small>Response: {region.latency === null ? "Unavailable" : `${region.latency} ms`}</small>

      </div>

    </div>

  );

}

function BottomPanels({ regions }: { regions: Region[] }) {

  const max = Math.max(...regions.map((r) => r.latency ?? 0), 1);

  return (

    <div className="bottom-grid">

      <section className="bottom-panel">

        <div className="bottom-header">

          <div>

            <BarChart3 size={20} />

            <h2>Latency Comparison</h2>

          </div>

          <span>Lower is Better ↓</span>

        </div>

        <div className="bars">

          {regions.map((region) => {

            const color =

              region.status === "HIGH"

                ? "red"

                : region.status === "AVERAGE"

                  ? "yellow"

                  : "green";

            return (

              <div className="bar-row" key={region.aws}>

                <span>

                  {region.name}{" "}

                  <small>({region.aws})</small>

                </span>

                <div className="bar-track">

                  <div

                    className={`bar ${color}`}

                    style={{

                      width: `${Math.max(

                        ((region.latency ?? 0) / max) * 100,

                        8

                      )}%`,

                    }}

                  />

                </div>

                <b>{region.latency} ms</b>

              </div>

            );

          })}

        </div>

      </section>

      <section className="bottom-panel">

        <div className="bottom-header">

          <div>

            <Clock3 size={20} />

            <h2>Recent Tests</h2>

          </div>

          <button>

            View All <ArrowRight size={14} />

          </button>

        </div>

        <div className="table">

          <div className="table-head">

            <span>Date & Time</span>

            <span>Your Location</span>

            <span>Best Region</span>

            <span>Latency</span>

          </div>

          {[

            ["07 Oct 2026, 14:32", "India (Telangana)", "Mumbai", "24 ms"],

            ["06 Oct 2026, 16:18", "India (Telangana)", "Mumbai", "27 ms"],

            ["05 Oct 2026, 11:45", "India (Telangana)", "Singapore", "61 ms"],

            ["04 Oct 2026, 19:20", "India (Telangana)", "Mumbai", "26 ms"],

          ].map((row) => (

            <div className="table-row" key={row[0]}>

              <span>{row[0]}</span>

              <span>{row[1]}</span>

              <span>{row[2]}</span>

              <b>{row[3]}</b>

            </div>

          ))}

        </div>

      </section>

    </div>

  );

}

type HistoryItem = {

  id: number;

  tested_at: string;

  location: string;

  best_region: string | null;

  best_latency: number | null;

  region_count: number;

};

function PageHeader({

  eyebrow,

  title,

  description,

}: {

  eyebrow: string;

  title: string;

  description: string;

}) {

  return (

    <div className="page-heading">

      <span>{eyebrow}</span>

      <h2>{title}</h2>

      <p>{description}</p>

    </div>

  );

}

function LatencyTestPage({

  regions,

  selected,

  toggle,

  onRun,

  testing,

}: {

  regions: Region[];

  selected: string[];

  toggle: (aws: string) => void;

  onRun: () => void;

  testing: boolean;

}) {

  return (

    <div className="module-page">

      <PageHeader

        eyebrow="NETWORK DIAGNOSTICS"

        title="Latency Test"

        description="Run a live latency measurement against the selected AWS regions from the REGIONX backend."

      />

      <div className="module-grid two">

        <section className="module-card test-launch-card">

          <div className="module-icon blue"><Zap size={24} /></div>

          <h3>Start a live test</h3>

          <p>Select at least one region, then run the test. The backend measures each endpoint in parallel.</p>

          <div className="test-region-list">

            {regions.map((region) => (

              <button

                key={region.aws}

                className={`test-region ${selected.includes(region.aws) ? "selected" : ""}`}

                onClick={() => toggle(region.aws)}

              >

                <Flag country={region.country} fallback={region.flag} />

                <span><strong>{region.name}</strong><small>{region.aws}</small></span>

                {selected.includes(region.aws) ? <CheckCircle2 size={18} /> : <span className="empty-dot" />}

              </button>

            ))}

          </div>

          <button className="primary-action" onClick={onRun} disabled={testing}>

            {testing ? <RefreshCw size={17} className="spin" /> : <Play size={17} fill="white" />}

            {testing ? "Testing regions…" : "Run Latency Test"}

          </button>

        </section>

        <section className="module-card diagnostics-card">

          <div className="module-card-title"><Server size={19} /><h3>Test methodology</h3></div>

          <div className="method-row"><span>1</span><div><strong>Reachability</strong><p>Connect to the regional AWS S3 endpoint.</p></div></div>

          <div className="method-row"><span>2</span><div><strong>Round-trip timing</strong><p>Measure the response time in milliseconds.</p></div></div>

          <div className="method-row"><span>3</span><div><strong>Classification</strong><p>Excellent, Good, Average, or High based on latency.</p></div></div>

          <div className="method-row"><span>4</span><div><strong>Recommendation</strong><p>The fastest reachable region becomes the best region.</p></div></div>

        </section>

      </div>

      <section className="module-card results-module">

        <div className="module-card-title"><Activity size={19} /><h3>Latest measurements</h3><span className="module-muted">{selected.length} regions selected</span></div>

        <div className="test-results-grid">

          {regions.filter((r) => selected.includes(r.aws)).map((region) => (

            <div className="test-result" key={region.aws}>

              <div className={`result-dot ${region.status.toLowerCase()}`} />

              <Flag country={region.country} fallback={region.flag} />

              <div><strong>{region.name}</strong><small>{region.aws}</small></div>

              <b>{region.latency === null ? "—" : `${region.latency} ms`}</b>

            </div>

          ))}

        </div>

      </section>

    </div>

  );

}

function HistoryPage({ history, onRefresh }: { history: HistoryItem[]; onRefresh: () => void }) {

  return (

    <div className="module-page">

      <PageHeader

        eyebrow="TEST HISTORY"

        title="History"

        description="Every completed REGIONX latency test saved by the PostgreSQL backend appears here."

      />

      <section className="module-card history-module">

        <div className="module-card-title">

          <Clock3 size={19} /><h3>Recent Tests</h3>

          <button className="ghost-action" onClick={onRefresh}><RefreshCw size={14} /> Refresh</button>

        </div>

        {history.length === 0 ? (

          <div className="empty-state"><Database size={28} /><strong>No tests saved yet</strong><p>Run a latency test and its result will appear here.</p></div>

        ) : (

          <div className="history-table">

            <div className="history-head"><span>Date & Time</span><span>Location</span><span>Regions</span><span>Best Region</span><span>Latency</span></div>

            {history.map((item) => (

              <div className="history-row" key={item.id}>

                <span>{new Date(item.tested_at).toLocaleString()}</span>

                <span>{item.location}</span>

                <span>{item.region_count}</span>

                <span>{item.best_region ?? "Unavailable"}</span>

                <b>{item.best_latency === null ? "—" : `${item.best_latency} ms`}</b>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>

  );

}

function ArchitecturePage() {

  return (

    <div className="module-page">

      <PageHeader eyebrow="SYSTEM DESIGN" title="Architecture" description="How REGIONX connects the React dashboard, Node.js API, AWS endpoints, and PostgreSQL history store." />

      <div className="architecture-flow">

        <div className="arch-card"><Code2 size={25} /><span>01</span><h3>React + TypeScript</h3><p>Interactive dashboard, region selection, live results and visual analytics.</p></div>

        <ArrowRight className="arch-arrow" />

        <div className="arch-card"><Server size={25} /><span>02</span><h3>Node.js + Express</h3><p>Runs latency probes in parallel and exposes REST endpoints to the frontend.</p></div>

        <ArrowRight className="arch-arrow" />

        <div className="arch-card"><Globe2 size={25} /><span>03</span><h3>AWS Regional Endpoints</h3><p>Mumbai, Singapore, Frankfurt and US East are measured independently.</p></div>

        <ArrowRight className="arch-arrow" />

        <div className="arch-card"><Database size={25} /><span>04</span><h3>PostgreSQL</h3><p>Stores completed tests so the History module can retrieve past measurements.</p></div>

      </div>

    </div>

  );

}

function AboutPage() {

  return (

    <div className="module-page">

      <PageHeader eyebrow="ABOUT REGIONX" title="Cloud Region Latency Comparator" description="A focused cloud-computing project for discovering which deployment region responds fastest from the test environment." />

      <div className="module-grid two">

        <section className="module-card about-card"><div className="module-icon blue"><Cloud size={24} /></div><h3>What REGIONX does</h3><p>REGIONX measures network response time to multiple AWS regions, classifies the measurements and recommends the fastest reachable region.</p></section>

        <section className="module-card about-card"><div className="module-icon green"><Trophy size={24} /></div><h3>Why it matters</h3><p>Choosing a closer region can reduce network latency for users and improve the responsiveness of cloud-hosted applications.</p></section>

      </div>

      <div className="tech-strip"><span>React</span><span>TypeScript</span><span>Node.js</span><span>Express</span><span>AWS</span><span>PostgreSQL</span></div>

    </div>

  );

}

function App() {

  const [regions, setRegions] = useState<Region[]>(initialRegions);

  const [selected, setSelected] = useState<string[]>(initialRegions.map((r) => r.aws));

  const [active, setActive] = useState("Dashboard");

  const [testing, setTesting] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const selectedData = useMemo(() => regions.filter((r) => selected.includes(r.aws)), [regions, selected]);

  const best = useMemo(() => [...selectedData].filter((r) => r.latency !== null).sort((a, b) => (a.latency ?? Infinity) - (b.latency ?? Infinity))[0], [selectedData]);

  const loadHistory = async () => {

    try {

      const response = await fetch("http://- 3.211.69.195:10000/api/history?limit=20");

      if (!response.ok) return;

      const data = await response.json();

      if (data.success && Array.isArray(data.history)) setHistory(data.history);

    } catch (error) {

      console.warn("History unavailable:", error);

    }

  };

  useEffect(() => { void loadHistory(); }, []);

  const toggle = (aws: string) => {

    setSelected((current) => {

      if (current.includes(aws)) {

        if (current.length === 1) return current;

        return current.filter((x) => x !== aws);

      }

      return [...current, aws];

    });

  };

  const runLatencyTest = async () => {

    if (selected.length === 0 || testing) return;

    setTesting(true);

    try {

      const response = await fetch(

        `http://http://- 3.211.69.195:10000/api/latency?regions=${encodeURIComponent(

          selected.join(",")

        )}`

      );

      if (!response.ok) throw new Error(`Backend returned ${response.status}`);

      const data = await response.json();

      if (!data.success || !Array.isArray(data.results)) throw new Error(data.message || "Invalid latency response");

      setRegions((current) => current.map((region) => {

        if (!selected.includes(region.aws)) return region;

        const result = data.results.find((item: { region: string; latency: number; reachable: boolean }) => item.region === region.aws);

        if (!result) return region;

        return {

          ...region,

          latency: result.reachable ? result.latency : null,

          status: result.reachable ? getStatus(result.latency) : "HIGH",

        };

      }));

      await loadHistory();

      setActive("Dashboard");

    } catch (error) {

      console.error("Latency test failed:", error);

      alert("Latency test failed.\n\nMake sure the REGIONX backend is running on port 10000 and PostgreSQL is configured.");

    } finally {

      setTesting(false);

    }

  };

  const renderPage = () => {

    if (active === "Dashboard") {

      return (

        <>

          <div className="dashboard-grid">

            <div className="dashboard-left">

              <NetworkMap regions={selectedData} />

              <div className="latency-cards">{selectedData.map((region) => <LatencyCard key={region.aws} region={region} />)}</div>

            </div>

            <BestRegion region={best} />

          </div>

          <BottomPanels regions={selectedData} />

        </>

      );

    }

    if (active === "Latency Test") return <LatencyTestPage regions={regions} selected={selected} toggle={toggle} onRun={runLatencyTest} testing={testing} />;

    if (active === "History") return <HistoryPage history={history} onRefresh={loadHistory} />;

    if (active === "Architecture") return <ArchitecturePage />;

    return <AboutPage />;

  };

  return (

    <div className="app">

      <Sidebar active={active} setActive={setActive} />

      <main className="main">

        <Header />

        <div className="content">

          {active === "Dashboard" && <RegionSelector regions={regions} selected={selected} toggle={toggle} onStart={runLatencyTest} />}

          {renderPage()}

        </div>

      </main>

    </div>

  );

}

export default App;
