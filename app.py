"""
🕵️ FlowGuard AI - ADVANCED Enterprise AML Detection System  
iDEA 2.0 Hackathon | Problem Statement PS3
AI-Powered Multi-Algorithm Fraud Detection System
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
import time
import warnings
warnings.filterwarnings('ignore')

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from scipy import stats

# ============================================================================
# PAGE CONFIG
# ============================================================================

st.set_page_config(
    page_title="FlowGuard AI - Enterprise AML Detection",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={'Get Help': 'https://ai.google.dev/', 'Report a bug': None}
)

st.markdown("""
<style>
    [data-testid="stMetricValue"] { font-size: 28px; font-weight: bold; }
</style>
""", unsafe_allow_html=True)

if 'uploaded_df' not in st.session_state:
    st.session_state.uploaded_df = None
if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = None

st.title("🕵️ FlowGuard AI - ADVANCED Enterprise AML Detection")
st.markdown("**Multi-Algorithm AI Fraud Detection | 12-Factor Risk Scoring | Pattern Recognition**")
st.markdown("Problem Statement: PS3 - Tracking of Funds within Bank for Fraud Detection")
st.divider()

# ============================================================================
# ADVANCED AML ENGINE - Multi-Algorithm Approach
# ============================================================================

class AdvancedAMLEngine:
    def __init__(self, df):
        self.df = df.copy()
        self.amount_mean = self.df['amount'].mean()
        self.amount_std = max(self.df['amount'].std(), 1)
        self.amount_q95 = self.df['amount'].quantile(0.95)
        
        try:
            X = self.df[['amount']].values
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            self.iso_forest = IsolationForest(contamination=0.08, random_state=42, n_estimators=100)
            self.iso_forest.fit(X_scaled)
            self.scaler = scaler
        except:
            self.iso_forest = None
            self.scaler = None
    
    def _detect_smurfing(self, customer_txns):
        """Detect smurfing (structured deposits)"""
        if len(customer_txns) < 3:
            return 0
        structured = customer_txns[
            ((customer_txns['amount'] >= 9500) & (customer_txns['amount'] <= 10500)) |
            ((customer_txns['amount'] >= 49500) & (customer_txns['amount'] <= 50500))
        ]
        if len(structured) >= 3:
            return min(len(structured) * 8, 35)
        return 0
    
    def _detect_layering(self, customer_txns):
        """Detect layering (complex transaction chains)"""
        if len(customer_txns) < 5:
            return 0
        time_window = (customer_txns['timestamp'].max() - customer_txns['timestamp'].min()).total_seconds()
        if time_window == 0:
            return 0
        txns_per_hour = (len(customer_txns) / max(time_window / 3600, 1))
        if txns_per_hour > 3:
            return min(int(txns_per_hour * 7), 30)
        return 0
    
    def _detect_round_trip(self, customer_txns):
        """Detect round-trip transactions"""
        if len(customer_txns) < 2:
            return 0
        customer_txns_sorted = customer_txns.sort_values('timestamp').reset_index(drop=True)
        for i in range(len(customer_txns_sorted) - 1):
            curr = customer_txns_sorted.iloc[i]
            for j in range(i + 1, min(i + 5, len(customer_txns_sorted))):
                next_txn = customer_txns_sorted.iloc[j]
                if (str(curr.get('source_account', '')) == str(next_txn.get('dest_account', '')) and
                    str(curr.get('dest_account', '')) == str(next_txn.get('source_account', ''))):
                    return 40
        return 0
    
    def _detect_dormant_abuse(self, customer_txns):
        """Detect dormant account abuse"""
        if len(customer_txns) < 3:
            return 0
        sorted_txns = customer_txns.sort_values('timestamp')
        time_diffs = sorted_txns['timestamp'].diff().dt.total_seconds() / (24 * 3600)
        max_gap = time_diffs.max()
        recent_activity = len(sorted_txns.tail(5))
        if max_gap > 20 and recent_activity > 3:
            return 28
        return 0
    
    def _detect_high_velocity(self, customer_txns):
        """Detect high velocity transactions"""
        if len(customer_txns) < 10:
            return 0
        recent_txns = customer_txns.tail(20)
        total_amount = recent_txns['amount'].sum()
        if total_amount > self.amount_q95 * 5 and len(recent_txns) > 15:
            return min((len(recent_txns) - 10) * 3, 25)
        return 0
    
    def _isolation_forest_anomaly(self, amount):
        """ML Isolation Forest"""
        if self.iso_forest is None:
            return 0
        try:
            X = np.array([[amount]]).reshape(-1, 1)
            X_scaled = self.scaler.transform(X)
            anomaly_score = self.iso_forest.decision_function(X_scaled)[0]
            if anomaly_score < -0.3:
                return 20
            elif anomaly_score < -0.1:
                return 12
        except:
            pass
        return 0
    
    def _statistical_outlier(self, amount):
        """Z-score outlier detection"""
        z_score = abs((amount - self.amount_mean) / self.amount_std)
        if z_score > 4:
            return 22
        elif z_score > 3:
            return 15
        elif z_score > 2:
            return 8
        return 0
    
    def _benford_law_check(self, amount):
        """Benford's Law check"""
        if amount < 1:
            return 0
        first_digit = int(str(int(amount))[0])
        benford_probs = {1: 0.301, 2: 0.176, 3: 0.125, 4: 0.097, 5: 0.079,
                        6: 0.067, 7: 0.058, 8: 0.051, 9: 0.046}
        expected_prob = benford_probs.get(first_digit, 0.05)
        if expected_prob < 0.06:
            return 5
        return 0
    
    def calculate_advanced_risk_score(self, txn, customer_txns=None):
        """12-Factor Advanced Risk Scoring"""
        risk = 0
        factors = {}
        
        # Ensure txn is a dictionary
        if hasattr(txn, 'to_dict'):
            txn = txn.to_dict()
        
        amt = float(txn.get('amount', 0))
        
        # Factor 1: Statistical Outlier
        stat_risk = self._statistical_outlier(amt)
        if stat_risk > 0:
            risk += stat_risk
            factors['Statistical Outlier'] = stat_risk
        
        # Factor 2: Structuring Pattern
        if (9500 <= amt <= 10500) or (49500 <= amt <= 50500) or (amt % 1000 == 0 and amt > 5000):
            risk += 18
            factors['Structuring Pattern'] = 18
        
        # Factor 3: Off-Hours/Weekend
        ts = pd.to_datetime(txn.get('timestamp', datetime.now()))
        hour = ts.hour
        day = ts.weekday()
        if (hour < 6 or hour > 22) or day == 6:
            risk += 10
            factors['Off-Hours/Weekend'] = 10
        
        # Factor 4: Channel Risk
        ch = str(txn.get('channel', 'NEFT')).upper()
        if ch in ['WIRE', 'RTGS']:
            risk += 12
            factors['Wire Channel'] = 12
        elif ch == 'NEFT':
            risk += 3
        
        # Factor 5: High Amount
        if amt > self.amount_q95:
            risk += 13
            factors['High Amount'] = 13
        
        # Factor 6: Country Risk
        country = str(txn.get('country', '')).upper()
        if country in ['UA', 'RU', 'IR', 'KP', 'SY', 'LB', 'SO', 'KR']:
            risk += 12
            factors['Country Risk'] = 12
        
        # Factor 7: ML Anomaly
        iso_risk = self._isolation_forest_anomaly(amt)
        if iso_risk > 0:
            risk += iso_risk
            factors['ML Anomaly'] = iso_risk
        
        # Factor 8: Benford's Law
        benford_risk = self._benford_law_check(amt)
        if benford_risk > 0:
            risk += benford_risk
            factors['Benford Law'] = benford_risk
        
        # Advanced patterns
        if customer_txns is not None and len(customer_txns) > 0:
            smurfing = self._detect_smurfing(customer_txns)
            if smurfing > 0:
                risk += smurfing
                factors['Smurfing'] = smurfing
            
            layering = self._detect_layering(customer_txns)
            if layering > 0:
                risk += layering
                factors['Layering'] = layering
            
            roundtrip = self._detect_round_trip(customer_txns)
            if roundtrip > 0:
                risk += roundtrip
                factors['Round-Trip'] = roundtrip
            
            dormant = self._detect_dormant_abuse(customer_txns)
            if dormant > 0:
                risk += dormant
                factors['Dormant Abuse'] = dormant
            
            velocity = self._detect_high_velocity(customer_txns)
            if velocity > 0:
                risk += velocity
                factors['High Velocity'] = velocity
        
        # PEP Check
        purpose = str(txn.get('purpose', '')).lower()
        if any(kw in purpose for kw in ['gift', 'donation', 'political', 'party', 'campaign']):
            risk += 8
            factors['PEP Indicator'] = 8
        
        return round(min(risk, 100), 1), factors
    
    def analyze_transactions_advanced(self):
        """Analyze all transactions"""
        results = []
        customer_groups = self.df.groupby('customer_id')
        
        for idx, row in self.df.iterrows():
            customer_id = row.get('customer_id')
            customer_txns = customer_groups.get_group(customer_id) if customer_id in customer_groups.groups else pd.DataFrame()
            risk_score, factors = self.calculate_advanced_risk_score(row.to_dict(), customer_txns)
            
            results.append({
                'Row': idx + 1,
                'TXN_ID': str(row.get('txn_id', f'TXN-{idx}'))[:20],
                'Amount': float(row.get('amount', 0)),
                'Risk_Score': risk_score,
                'Severity': self._get_severity(risk_score),
                'Channel': str(row.get('channel', 'N/A'))[:10],
                'Customer': str(customer_id)[:15],
                'Timestamp': str(row.get('timestamp', 'N/A'))[:19],
                'Risk_Factors': json.dumps(factors),
                'Factor_Count': len(factors)
            })
        
        return pd.DataFrame(results)
    
    def _get_severity(self, score):
        if score >= 85: return '🔴 CRITICAL'
        elif score >= 65: return '🟠 HIGH'
        elif score >= 45: return '🟡 MEDIUM'
        else: return '🟢 LOW'

@st.cache_data
def generate_sample_data(num=5000):
    np.random.seed(42)
    data = []
    for i in range(num):
        is_fraud = np.random.random() < 0.08
        if is_fraud:
            amount = np.random.choice([9750, 10000, 49750, 50000]) + np.random.uniform(-200, 200)
            channel = np.random.choice(['WIRE', 'RTGS'])
            country = np.random.choice(['UA', 'RU', 'IR', 'LB'], p=[0.4, 0.3, 0.2, 0.1])
            purpose = np.random.choice(['gift', 'donation', 'investment'])
        else:
            amount = float(np.random.lognormal(10, 1.5))
            channel = np.random.choice(['NEFT', 'RTGS', 'IMPS', 'Wire'], p=[0.5, 0.2, 0.2, 0.1])
            country = np.random.choice(['IN', 'US', 'GB', 'UA', 'RU'], p=[0.75, 0.12, 0.08, 0.03, 0.02])
            purpose = np.random.choice(['Salary', 'Investment', 'Business', 'Personal'], p=[0.4, 0.3, 0.2, 0.1])
        
        data.append({
            'txn_id': f'TXN-{i:08d}',
            'customer_id': f'C-{np.random.randint(1, 101):03d}',
            'source_account': f'ACC-{np.random.randint(100000, 999999)}',
            'dest_account': f'ACC-{np.random.randint(100000, 999999)}',
            'amount': max(amount, 100),
            'channel': channel,
            'timestamp': pd.Timestamp('2024-01-01') + pd.Timedelta(minutes=np.random.randint(0, 14400)),
            'country': country,
            'purpose': purpose
        })
    
    return pd.DataFrame(data)

# ============================================================================
# TABS
# ============================================================================

tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "📊 Dashboard",
    "🎬 Live Simulation",
    "📤 Upload Data",
    "📈 Advanced Analytics",
    "📋 Compliance",
    "📥 Download"
])

# ============================================================================
# TAB 1: DASHBOARD
# ============================================================================

with tab1:
    st.header("🔍 System Overview")
    demo_df = generate_sample_data(5000)
    demo_engine = AdvancedAMLEngine(demo_df)
    demo_results = demo_engine.analyze_transactions_advanced()
    
    col1, col2, col3, col4, col5 = st.columns(5)
    total = len(demo_results)
    critical = len(demo_results[demo_results['Risk_Score'] >= 85])
    high = len(demo_results[demo_results['Risk_Score'] >= 65])
    medium = len(demo_results[demo_results['Risk_Score'] >= 45])
    avg_risk = demo_results['Risk_Score'].mean()
    
    with col1:
        st.metric("📊 Total", f"{total:,}")
    with col2:
        st.metric("🔴 CRITICAL", critical)
    with col3:
        st.metric("🟠 HIGH", high)
    with col4:
        st.metric("🟡 MEDIUM", medium)
    with col5:
        st.metric("📈 Avg Risk", f"{avg_risk:.1f}")
    
    st.divider()
    col1, col2 = st.columns([1.5, 1])
    
    with col1:
        st.subheader("🚀 Advanced 12-Factor Algorithm")
        st.markdown("""
        **Multi-Algorithm AI Approach:**
        - **Z-Score Outliers** - Statistical deviation
        - **Structuring Pattern** - Just below thresholds
        - **Off-Hours/Weekend** - Unusual timing
        - **High-Risk Channels** - Wire, RTGS
        - **High Amount Focus** - Top 5%
        - **Country Risk** - High-risk jurisdictions
        - **Isolation Forest ML** - Anomaly detection
        - **Benford's Law** - Natural distribution
        - **Smurfing Detection** - Multiple structured deposits
        - **Layering Detection** - Complex chains
        - **Round-Trip Detection** - Circular transactions
        - **Dormant Account Abuse** - Sudden activation
        """)
    
    with col2:
        fig = go.Figure(data=[
            go.Pie(
                labels=['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
                values=[critical, high, medium, total - critical - high - medium],
                marker=dict(colors=['#FF0000', '#FF8800', '#FFCC00', '#00CC00'])
            )
        ])
        st.plotly_chart(fig, use_container_width=True)
    
    st.divider()
    st.subheader("📊 Sample Transactions")
    display_df = demo_results.drop('Risk_Factors', axis=1).head(25)
    st.dataframe(display_df, use_container_width=True, height=450)

# ============================================================================
# TAB 2: LIVE SIMULATION
# ============================================================================

with tab2:
    st.header("🎬 Real-Time Fraud Detection")
    if st.button("▶️ START ADVANCED DEMO"):
        st.info("🎬 Running advanced fraud detection...")
        demo_df = generate_sample_data(5000)
        demo_engine = AdvancedAMLEngine(demo_df)
        
        col_txn, col_log = st.columns([1, 2])
        suspicious_txns = demo_df.sample(min(8, len(demo_df)), random_state=42).iterrows()
        
        logs = ["═" * 50, "🕵️ FlowGuard AI v3.0", "═" * 50]
        
        for idx, (_, txn) in enumerate(suspicious_txns):
            risk_score, factors = demo_engine.calculate_advanced_risk_score(txn.to_dict())
            severity = demo_engine._get_severity(risk_score)
            color_val = "#FF0000" if "CRITICAL" in severity else "#FF8800" if "HIGH" in severity else "#FFCC00" if "MEDIUM" in severity else "#00CC00"
            
            txn_card = f"""<div style='background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%); padding: 15px; border-radius: 10px; margin: 10px 0; border-left: 5px solid {color_val}; color: white;'><b>{severity}</b> | Txn {idx+1}<br/>💰 ₹{txn.get('amount', 0):,.0f} | 📊 {risk_score:.1f}/100<br/>👤 {txn.get('customer_id')} | 📱 {txn.get('channel')}</div>"""
            col_txn.markdown(txn_card, unsafe_allow_html=True)
            
            logs.append(f"[{idx+1}] Risk: {risk_score:.1f} | {severity}")
            for factor, value in factors.items():
                logs.append(f"    ✓ {factor}: +{value}")
            
            col_log.code("\n".join(logs), language="bash")
            time.sleep(0.7)
        
        st.success("✅ Demo Complete!")

# ============================================================================
# TAB 3: UPLOAD DATA
# ============================================================================

with tab3:
    st.header("📤 Upload & Advanced Analysis")
    uploaded_file = st.file_uploader("Upload CSV or Excel file", type=['csv', 'xlsx', 'xls'])
    
    if uploaded_file is not None:
        try:
            if uploaded_file.name.endswith('.csv'):
                upload_df = pd.read_csv(uploaded_file)
            else:
                upload_df = pd.read_excel(uploaded_file)
            
            upload_df.columns = upload_df.columns.str.lower().str.strip()
            st.session_state.uploaded_df = upload_df
            st.success(f"✅ Loaded {len(upload_df):,} transactions!")
            
            if st.button("🔬 Run Advanced Analysis"):
                with st.spinner("Running advanced AI analysis..."):
                    engine = AdvancedAMLEngine(upload_df)
                    results_df = engine.analyze_transactions_advanced()
                st.session_state.analysis_results = results_df
                st.success("✅ Analysis Complete!")
                
                col1, col2, col3, col4, col5 = st.columns(5)
                total = len(results_df)
                critical = len(results_df[results_df['Risk_Score'] >= 85])
                high = len(results_df[results_df['Risk_Score'] >= 65])
                medium = len(results_df[results_df['Risk_Score'] >= 45])
                avg_risk = results_df['Risk_Score'].mean()
                
                with col1:
                    st.metric("📊 Total", total)
                with col2:
                    st.metric("🔴 CRITICAL", critical)
                with col3:
                    st.metric("🟠 HIGH", high)
                with col4:
                    st.metric("🟡 MEDIUM", medium)
                with col5:
                    st.metric("📈 Avg", f"{avg_risk:.1f}")
                
                st.divider()
                col1, col2 = st.columns(2)
                
                with col1:
                    fig = px.histogram(results_df, x='Risk_Score', nbins=50, title='Risk Distribution', color_discrete_sequence=['#667eea'])
                    st.plotly_chart(fig, use_container_width=True)
                
                with col2:
                    sev = results_df['Severity'].value_counts()
                    fig = px.pie(values=sev.values, names=sev.index, title='Severity', color_discrete_map={'🔴 CRITICAL': '#FF0000', '🟠 HIGH': '#FF8800', '🟡 MEDIUM': '#FFCC00', '🟢 LOW': '#00CC00'})
                    st.plotly_chart(fig, use_container_width=True)
                
                st.divider()
                st.subheader("🚨 High-Risk Transactions (Risk ≥ 65)")
                high_risk = results_df[results_df['Risk_Score'] >= 65].sort_values('Risk_Score', ascending=False)
                st.metric("⚠️ Flagged", len(high_risk))
                
                if len(high_risk) > 0:
                    st.dataframe(high_risk[['TXN_ID', 'Amount', 'Risk_Score', 'Severity', 'Factor_Count']], use_container_width=True, height=250)
                    
                    st.divider()
                    st.subheader("🔍 Detailed Analysis (Top 5)")
                    for idx, row in high_risk.head(5).iterrows():
                        factors = json.loads(row['Risk_Factors'])
                        with st.expander(f"{row['TXN_ID']} | ₹{row['Amount']:,.0f} | {row['Risk_Score']}/100"):
                            col1, col2 = st.columns(2)
                            with col1:
                                st.write(f"**Customer**: {row['Customer']}\n**Channel**: {row['Channel']}\n**Time**: {row['Timestamp']}")
                            with col2:
                                st.write("**Risk Factors**:")
                                for f, v in sorted(factors.items(), key=lambda x: x[1], reverse=True):
                                    st.write(f"• {f}: +{v}")
        except Exception as e:
            st.error(f"Error: {e}")

# ============================================================================
# TAB 4: ADVANCED ANALYTICS
# ============================================================================

with tab4:
    st.header("📈 Advanced Analytics")
    results = st.session_state.analysis_results if st.session_state.analysis_results is not None else AdvancedAMLEngine(generate_sample_data(5000)).analyze_transactions_advanced()
    
    col1, col2 = st.columns(2)
    with col1:
        fig = px.histogram(results, x='Risk_Score', nbins=50, title='Risk Distribution', color_discrete_sequence=['#667eea'])
        st.plotly_chart(fig, use_container_width=True)
    with col2:
        fig = px.scatter(results.head(1000), x='Amount', y='Risk_Score', color='Severity', size='Factor_Count', color_discrete_map={'🔴 CRITICAL': '#FF0000', '🟠 HIGH': '#FF8800', '🟡 MEDIUM': '#FFCC00', '🟢 LOW': '#00CC00'}, title='Amount vs Risk')
        st.plotly_chart(fig, use_container_width=True)

# ============================================================================
# TAB 5: COMPLIANCE
# ============================================================================

with tab5:
    st.header("📋 Compliance Framework")
    results = st.session_state.analysis_results if st.session_state.analysis_results is not None else AdvancedAMLEngine(generate_sample_data(5000)).analyze_transactions_advanced()
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Analyzed", len(results))
    with col2:
        st.metric("CRITICAL", len(results[results['Risk_Score'] >= 85]))
    with col3:
        st.metric("FIU Reports", len(results[results['Risk_Score'] >= 60]))
    
    st.divider()
    st.subheader("✅ Compliance Standards")
    st.success("🇮🇳 RBI Master Direction - KYC & Due Diligence")
    st.success("⚖️ PMLA 2002 - Money Laundering Prevention")
    st.success("🌍 FATF 40 - Financial Action Task Force")
    st.success("🏦 FIU-IND - Financial Intelligence Unit")

# ============================================================================
# TAB 6: DOWNLOAD
# ============================================================================

with tab6:
    st.header("📥 Download Results")
    results = st.session_state.analysis_results if st.session_state.analysis_results is not None else AdvancedAMLEngine(generate_sample_data(5000)).analyze_transactions_advanced()
    
    col1, col2, col3, col4 = st.columns(4)
    
    # Export All Results (CSV)
    with col1:
        csv = results.to_csv(index=False)
        st.download_button(
            label="📊 CSV (All)",
            data=csv,
            file_name="aml_analysis_all.csv",
            mime="text/csv"
        )
    
    # Export as JSON
    with col2:
        json_data = results.to_json(orient='records', indent=2)
        st.download_button(
            label="📋 JSON",
            data=json_data,
            file_name="aml_analysis.json",
            mime="application/json"
        )
    
    # Export Critical Only
    with col3:
        critical = results[results['Risk_Score'] >= 85]
        csv_critical = critical.to_csv(index=False)
        st.download_button(
            label="🔴 CRITICAL",
            data=csv_critical,
            file_name="aml_critical_alerts.csv",
            mime="text/csv",
            disabled=len(critical) == 0
        )
    
    # Export Alerts (High & Critical)
    with col4:
        alerts = results[results['Risk_Score'] >= 65]
        csv_alerts = alerts.to_csv(index=False)
        st.download_button(
            label="⚠️ Alerts",
            data=csv_alerts,
            file_name="aml_alerts.csv",
            mime="text/csv",
            disabled=len(alerts) == 0
        )
    
    st.divider()
    st.subheader("📊 Summary Statistics")
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.metric("Total Records", len(results))
    with col2:
        st.metric("🔴 CRITICAL", len(results[results['Risk_Score'] >= 85]))
    with col3:
        st.metric("🟠 HIGH", len(results[results['Risk_Score'] >= 65]))
    with col4:
        st.metric("🟡 MEDIUM", len(results[results['Risk_Score'] >= 45]))
    with col5:
        st.metric("Avg Risk", f"{results['Risk_Score'].mean():.1f}")
    
    st.divider()
    st.subheader("🚨 Flagged Transactions")
    flagged = results[results['Risk_Score'] >= 45].sort_values('Risk_Score', ascending=False)
    st.metric("Total Flagged", len(flagged))
    
    if len(flagged) > 0:
        st.dataframe(flagged, use_container_width=True, height=400)
    st.header("📥 Download Results")
    results = st.session_state.analysis_results if st.session_state.analysis_results is not None else AdvancedAMLEngine(generate_sample_data(5000)).analyze_transactions_advanced()
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        csv = results.to_csv(index=False)
        st.download_button("📄 All Results", data=csv, file_name=f"flowguard_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv", use_container_width=True)
    with col2:
        json_data = results.to_json(orient='records')
        st.download_button("🟣 JSON", data=json_data, file_name=f"flowguard_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", use_container_width=True)
    with col3:
        alerts = results[results['Risk_Score'] >= 60].to_csv(index=False)
        st.download_button("🚨 Alerts", data=alerts, file_name=f"alerts_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv", use_container_width=True)
    with col4:
        critical = results[results['Risk_Score'] >= 85].to_csv(index=False)
        st.download_button("🔴 CRITICAL", data=critical, file_name=f"critical_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv", use_container_width=True)

st.divider()
col1, col2, col3 = st.columns(3)
with col1:
    st.success("✅ Advanced AI Detection")
with col2:
    st.info("🎯 12-Factor Risk Scoring")
with col3:
    st.caption("FlowGuard AI v3.0 | Multi-Algorithm Approach")
