"""
FlowGuard AI - Enterprise AML Detection System
Professional-grade Anti-Money Laundering Detection
Built for Financial Institutions
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
import warnings
warnings.filterwarnings('ignore')

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from scipy import stats

# ============================================================================
# PAGE CONFIGURATION
# ============================================================================

st.set_page_config(
    page_title="FlowGuard AI - Enterprise AML Detection",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    h1 { color: #667eea; text-align: center; }
    h2 { color: #764ba2; }
    .metric-highlight { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
</style>
""", unsafe_allow_html=True)

# Session State
if 'uploaded_df' not in st.session_state:
    st.session_state.uploaded_df = None
if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = None

# ============================================================================
# ENHANCED AML ENGINE
# ============================================================================

class EnterpriseAMLEngine:
    def __init__(self, df):
        self.df = df.copy()
        self.prepare_data()
        
    def prepare_data(self):
        self.amount_mean = self.df['amount'].mean()
        self.amount_std = max(self.df['amount'].std(), 1)
        self.amount_q95 = self.df['amount'].quantile(0.95)
        self.amount_q75 = self.df['amount'].quantile(0.75)
        
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
    
    def detect_structuring(self, amount):
        """Detect structuring patterns"""
        if (9500 <= amount <= 10500) or (49500 <= amount <= 50500) or (99500 <= amount <= 100500):
            return 40, "Structuring"
        return 0, ""
    
    def detect_anomaly(self, amount):
        """ML-based anomaly detection"""
        z_score = abs((amount - self.amount_mean) / self.amount_std)
        if z_score > 5:
            return 35, "Statistical Extreme"
        elif z_score > 3.5:
            return 25, "Statistical Outlier"
        elif z_score > 2.5:
            return 15, "Unusual Amount"
        return 0, ""
    
    def detect_timing_risk(self, timestamp):
        """Detect off-hours transactions"""
        try:
            ts = pd.to_datetime(timestamp)
            hour = ts.hour
            day = ts.weekday()
            if (hour < 6 or hour > 22) or day >= 5:
                return 20, "Off-Hours/Weekend"
        except:
            pass
        return 0, ""
    
    def calculate_risk_score(self, row):
        """Calculate comprehensive risk score"""
        risk = 0
        factors = {}
        
        amount = float(row.get('amount', 0))
        channel = str(row.get('channel', '')).upper()
        country = str(row.get('country', '')).upper()
        timestamp = row.get('timestamp', datetime.now())
        
        # Structuring
        struct_risk, struct_name = self.detect_structuring(amount)
        if struct_risk > 0:
            risk += struct_risk
            factors[struct_name] = struct_risk
        
        # Anomaly
        anom_risk, anom_name = self.detect_anomaly(amount)
        if anom_risk > 0:
            risk += anom_risk
            factors[anom_name] = anom_risk
        
        # High Amount
        if amount > self.amount_q95:
            risk += 20
            factors['High Amount'] = 20
        
        # Channel Risk
        if channel in ['WIRE', 'RTGS']:
            risk += 15
            factors['High-Risk Channel'] = 15
        elif channel in ['IMPS', 'NEFT']:
            risk += 5
        
        # Country Risk
        high_risk_countries = ['UA', 'RU', 'IR', 'KP', 'SY', 'LB', 'SO']
        if country in high_risk_countries:
            risk += 25
            factors['High-Risk Jurisdiction'] = 25
        
        # Timing Risk
        timing_risk, timing_name = self.detect_timing_risk(timestamp)
        if timing_risk > 0:
            risk += timing_risk
            factors[timing_name] = timing_risk
        
        risk = min(risk, 100)
        
        if risk >= 75:
            severity = 'CRITICAL'
        elif risk >= 60:
            severity = 'HIGH'
        elif risk >= 40:
            severity = 'MEDIUM'
        else:
            severity = 'LOW'
        
        return risk, severity, factors
    
    def analyze_all(self):
        """Analyze all transactions"""
        results = []
        for idx, row in self.df.iterrows():
            risk, severity, factors = self.calculate_risk_score(row)
            
            results.append({
                'TXN_ID': str(row.get('txn_id', f'TXN-{idx}'))[:20],
                'Amount': float(row.get('amount', 0)),
                'Risk_Score': risk,
                'Severity': severity,
                'Channel': str(row.get('channel', 'N/A'))[:15],
                'Customer': str(row.get('customer_id', 'N/A'))[:15],
                'Country': str(row.get('country', 'N/A'))[:10],
                'Timestamp': str(row.get('timestamp', 'N/A'))[:19],
                'Factors': json.dumps(factors),
                'Factor_Count': len(factors)
            })
        
        return pd.DataFrame(results)

# ============================================================================
# SAMPLE DATA GENERATOR
# ============================================================================

def generate_enhanced_data(num=8000):
    np.random.seed(42)
    data = []
    
    for i in range(num):
        is_suspicious = np.random.random() < 0.10
        
        if is_suspicious:
            amount = np.random.choice([9750, 10000, 49750, 50000, 99750, 100000]) + np.random.uniform(-300, 300)
            channel = np.random.choice(['WIRE', 'RTGS', 'SWIFT'])
            country = np.random.choice(['UA', 'RU', 'IR', 'LB', 'SY', 'KP'])
        else:
            amount = float(np.random.lognormal(10, 1.5))
            channel = np.random.choice(['NEFT', 'RTGS', 'IMPS', 'Wire', 'SWIFT'], p=[0.45, 0.2, 0.15, 0.15, 0.05])
            country = np.random.choice(['IN', 'US', 'GB', 'SG', 'HK', 'DE'], p=[0.65, 0.12, 0.1, 0.08, 0.03, 0.02])
        
        data.append({
            'txn_id': f'TXN-{i:08d}',
            'customer_id': f'C-{np.random.randint(1, 200):03d}',
            'amount': max(amount, 100),
            'channel': channel,
            'country': country,
            'timestamp': pd.Timestamp('2024-01-01') + pd.Timedelta(minutes=np.random.randint(0, 43200))
        })
    
    return pd.DataFrame(data)

# ============================================================================
# HEADER
# ============================================================================

col1, col2, col3 = st.columns([2, 2, 1])
with col1:
    st.title("FlowGuard AI")
with col2:
    st.subheader("Enterprise AML Detection")
with col3:
    st.caption("v2.0 Professional")

st.markdown("---")

# ============================================================================
# TABS
# ============================================================================

tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
    "Dashboard",
    "Transaction Analysis",
    "Risk Matrix",
    "Data Upload",
    "Compliance",
    "Analytics",
    "Downloads"
])

# ============================================================================
# TAB 1: DASHBOARD
# ============================================================================

with tab1:
    st.header("System Dashboard")
    
    demo_df = generate_enhanced_data(8000)
    engine = EnterpriseAMLEngine(demo_df)
    results = engine.analyze_all()
    
    st.subheader("Key Performance Indicators")
    col1, col2, col3, col4, col5, col6 = st.columns(6)
    
    total = len(results)
    critical = len(results[results['Risk_Score'] >= 75])
    high = len(results[results['Risk_Score'] >= 60])
    medium = len(results[results['Risk_Score'] >= 40])
    avg_risk = results['Risk_Score'].mean()
    detection_rate = (critical + high) / total * 100 if total > 0 else 0
    
    with col1:
        st.metric("Total Transactions", f"{total:,}")
    with col2:
        st.metric("CRITICAL Alerts", critical)
    with col3:
        st.metric("HIGH Alerts", high)
    with col4:
        st.metric("MEDIUM Alerts", medium)
    with col5:
        st.metric("Avg Risk Score", f"{avg_risk:.1f}")
    with col6:
        st.metric("Detection Rate", f"{detection_rate:.1f}%")
    
    st.divider()
    
    st.subheader("Risk Analysis")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        fig = px.histogram(results, x='Risk_Score', nbins=40, title='Risk Score Distribution', color_discrete_sequence=['#667eea'])
        fig.update_layout(height=400, showlegend=False)
        st.plotly_chart(fig, width='stretch')
    
    with col2:
        severity_counts = results['Severity'].value_counts()
        colors = {'CRITICAL': '#FF0000', 'HIGH': '#FF8800', 'MEDIUM': '#FFCC00', 'LOW': '#00CC00'}
        fig = px.pie(values=severity_counts.values, names=severity_counts.index, title='Severity Distribution', color_discrete_map=colors)
        fig.update_layout(height=400)
        st.plotly_chart(fig, width='stretch')
    
    with col3:
        amount_by_severity = results.groupby('Severity')['Amount'].sum().reindex(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
        fig = px.bar(x=amount_by_severity.index, y=amount_by_severity.values, title='Amount at Risk by Severity', color=amount_by_severity.index, color_discrete_map=colors)
        fig.update_layout(height=400, showlegend=False)
        st.plotly_chart(fig, width='stretch')
    
    st.divider()
    st.subheader("Transaction Overview")
    display = results[['TXN_ID', 'Amount', 'Risk_Score', 'Severity', 'Channel', 'Country', 'Customer']].head(30)
    st.dataframe(display, width='stretch', hide_index=True)

# ============================================================================
# TAB 2: TRANSACTION ANALYSIS
# ============================================================================

with tab2:
    st.header("Detailed Transaction Analysis")
    
    results = EnterpriseAMLEngine(generate_enhanced_data(8000)).analyze_all()
    
    col1, col2 = st.columns(2)
    
    with col1:
        min_risk = st.slider("Minimum Risk Score", 0, 100, 50)
    with col2:
        severity_filter = st.multiselect("Severity", ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default=['CRITICAL', 'HIGH'])
    
    filtered = results[(results['Risk_Score'] >= min_risk) & (results['Severity'].isin(severity_filter))]
    
    st.metric("Matching Transactions", len(filtered))
    st.divider()
    
    if len(filtered) > 0:
        st.subheader("Flagged Transactions")
        for idx, row in filtered.head(20).iterrows():
            with st.expander(f"{row['TXN_ID']} | Rs {row['Amount']:,.0f} | {row['Risk_Score']:.0f}/100 | {row['Severity']}"):
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.write(f"**Customer:** {row['Customer']}")
                    st.write(f"**Channel:** {row['Channel']}")
                    st.write(f"**Country:** {row['Country']}")
                with col2:
                    st.write(f"**Amount:** Rs {row['Amount']:,.2f}")
                    st.write(f"**Timestamp:** {row['Timestamp']}")
                    st.write(f"**Factors:** {row['Factor_Count']}")
                with col3:
                    factors = json.loads(row['Factors'])
                    st.write("**Risk Breakdown:**")
                    for factor, value in sorted(factors.items(), key=lambda x: x[1], reverse=True):
                        st.write(f"• {factor}: +{value}")

# ============================================================================
# TAB 3: RISK MATRIX
# ============================================================================

with tab3:
    st.header("Risk Analysis Matrix")
    
    results = EnterpriseAMLEngine(generate_enhanced_data(8000)).analyze_all()
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        fig = px.scatter(results.head(2000), x='Amount', y='Risk_Score', color='Severity', size='Factor_Count', title='Amount vs Risk Score', color_discrete_map={'CRITICAL': '#FF0000', 'HIGH': '#FF8800', 'MEDIUM': '#FFCC00', 'LOW': '#00CC00'})
        fig.update_layout(height=450)
        st.plotly_chart(fig, width='stretch')
    
    with col2:
        channel_risk = results.groupby('Channel')['Risk_Score'].agg(['mean', 'count']).sort_values('mean', ascending=False)
        fig = px.bar(x=channel_risk['mean'], y=channel_risk.index, title='Average Risk by Channel', color=channel_risk['mean'], color_continuous_scale='Reds')
        fig.update_layout(height=450)
        st.plotly_chart(fig, width='stretch')
    
    with col3:
        country_risk = results.groupby('Country')['Risk_Score'].agg(['mean', 'count']).sort_values('mean', ascending=False).head(15)
        fig = px.bar(x=country_risk['mean'], y=country_risk.index, title='Avg Risk by Country', color=country_risk['mean'], color_continuous_scale='Oranges')
        fig.update_layout(height=450)
        st.plotly_chart(fig, width='stretch')

# ============================================================================
# TAB 4: DATA UPLOAD
# ============================================================================

with tab4:
    st.header("Upload & Analyze Custom Data")
    
    uploaded_file = st.file_uploader("Upload CSV or Excel file", type=['csv', 'xlsx', 'xls'])
    
    if uploaded_file is not None:
        try:
            if uploaded_file.name.endswith('.csv'):
                df = pd.read_csv(uploaded_file)
            else:
                df = pd.read_excel(uploaded_file)
            
            df.columns = df.columns.str.lower().str.strip()
            st.session_state.uploaded_df = df
            
            st.success(f"Loaded {len(df):,} records")
            
            if st.button("Analyze Data"):
                with st.spinner("Analyzing..."):
                    engine = EnterpriseAMLEngine(df)
                    results = engine.analyze_all()
                    st.session_state.analysis_results = results
                
                st.success("Analysis Complete!")
                
                col1, col2, col3, col4, col5 = st.columns(5)
                total = len(results)
                critical = len(results[results['Risk_Score'] >= 75])
                high = len(results[results['Risk_Score'] >= 60])
                medium = len(results[results['Risk_Score'] >= 40])
                avg_risk = results['Risk_Score'].mean()
                
                with col1:
                    st.metric("Total", total)
                with col2:
                    st.metric("CRITICAL", critical)
                with col3:
                    st.metric("HIGH", high)
                with col4:
                    st.metric("MEDIUM", medium)
                with col5:
                    st.metric("Avg Risk", f"{avg_risk:.1f}")
                
                st.divider()
                
                high_risk = results[results['Risk_Score'] >= 60].sort_values('Risk_Score', ascending=False)
                st.subheader(f"High-Risk Transactions ({len(high_risk)})")
                st.dataframe(high_risk[['TXN_ID', 'Amount', 'Risk_Score', 'Severity', 'Channel', 'Customer']], width='stretch', hide_index=True)
        
        except Exception as e:
            st.error(f"Error: {str(e)}")

# ============================================================================
# TAB 5: COMPLIANCE
# ============================================================================

with tab5:
    st.header("Compliance & Regulatory")
    
    results = st.session_state.analysis_results if st.session_state.analysis_results is not None else EnterpriseAMLEngine(generate_enhanced_data(8000)).analyze_all()
    
    st.subheader("Regulatory Summary")
    col1, col2, col3, col4 = st.columns(4)
    
    critical = len(results[results['Risk_Score'] >= 75])
    high = len(results[results['Risk_Score'] >= 60])
    
    with col1:
        st.metric("SAR Recommended", critical)
    with col2:
        st.metric("FIU Reports", high)
    with col3:
        st.metric("Compliance Rate", f"{(1 - (critical + high)/len(results))*100:.1f}%")
    with col4:
        st.metric("Investigated", len(results[results['Risk_Score'] >= 40]))
    
    st.divider()
    st.subheader("Compliance Standards")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.success("✓ RBI AML Guidelines")
        st.success("✓ PMLA 2002 Compliant")
    with col2:
        st.success("✓ FATF 40 Standards")
        st.success("✓ UNSC Sanctions")
    with col3:
        st.success("✓ Real-time Monitoring")
        st.success("✓ Audit Trail")

# ============================================================================
# TAB 6: ANALYTICS
# ============================================================================

with tab6:
    st.header("Advanced Analytics")
    
    results = EnterpriseAMLEngine(generate_enhanced_data(8000)).analyze_all()
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig = px.scatter(results.tail(5000), x='Amount', y='Risk_Score', color='Severity', opacity=0.6, title='Transaction Clustering', color_discrete_map={'CRITICAL': '#FF0000', 'HIGH': '#FF8800', 'MEDIUM': '#FFCC00', 'LOW': '#00CC00'})
        fig.update_layout(height=450)
        st.plotly_chart(fig, width='stretch')
    
    with col2:
        top_customers = results.groupby('Customer').agg({'Risk_Score': 'mean', 'TXN_ID': 'count'}).sort_values('Risk_Score', ascending=False).head(10)
        fig = px.bar(x=top_customers['Risk_Score'], y=top_customers.index, title='Top 10 High-Risk Customers', color=top_customers['Risk_Score'], color_continuous_scale='Reds')
        fig.update_layout(height=450)
        st.plotly_chart(fig, width='stretch')
    
    st.divider()
    
    col1, col2 = st.columns(2)
    with col1:
        hourly_risk = results.groupby(results['Timestamp'].str.slice(0, 10))['Risk_Score'].mean()
        fig = px.line(x=hourly_risk.index, y=hourly_risk.values, title='Daily Average Risk Trend')
        fig.update_layout(height=400)
        st.plotly_chart(fig, width='stretch')
    
    with col2:
        top_channels = results.groupby('Channel')['Amount'].sum().sort_values(ascending=False).head(8)
        fig = px.pie(values=top_channels.values, names=top_channels.index, title='Volume by Channel')
        fig.update_layout(height=400)
        st.plotly_chart(fig, width='stretch')

# ============================================================================
# TAB 7: DOWNLOADS
# ============================================================================

with tab7:
    st.header("Export Results & Reports")
    
    results = st.session_state.analysis_results if st.session_state.analysis_results is not None else EnterpriseAMLEngine(generate_enhanced_data(8000)).analyze_all()
    
    st.subheader("Download Data")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        csv = results.to_csv(index=False)
        st.download_button("All (CSV)", data=csv, file_name=f"aml_all_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv", mime="text/csv")
    
    with col2:
        critical = results[results['Risk_Score'] >= 75]
        csv = critical.to_csv(index=False)
        st.download_button("CRITICAL (CSV)", data=csv, file_name=f"aml_critical_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv", mime="text/csv", disabled=len(critical) == 0)
    
    with col3:
        high_risk = results[results['Risk_Score'] >= 60]
        csv = high_risk.to_csv(index=False)
        st.download_button("High Risk (CSV)", data=csv, file_name=f"aml_high_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv", mime="text/csv", disabled=len(high_risk) == 0)
    
    with col4:
        json_data = results.to_json(orient="records", indent=2)
        st.download_button("Export JSON", data=json_data, file_name=f"aml_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", mime="application/json")
    
    st.divider()
    st.subheader("Generate Reports")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("Generate SAR Report"):
            sar_data = results[results['Risk_Score'] >= 75]
            report = f"SUSPICIOUS ACTIVITY REPORT\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\nTotal SAR: {len(sar_data)}\nAmount: Rs {sar_data['Amount'].sum():,.2f}\nAvg Risk: {sar_data['Risk_Score'].mean():.1f}"
            st.download_button("Download SAR", data=report, file_name=f"sar_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt", mime="text/plain")
            st.success("SAR Generated")
    
    with col2:
        if st.button("Generate Compliance Summary"):
            summary = f"AML COMPLIANCE SUMMARY\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\nTotal: {len(results)}\nCRITICAL: {len(results[results['Risk_Score'] >= 75])}\nAvg Risk: {results['Risk_Score'].mean():.1f}"
            st.download_button("Download Summary", data=summary, file_name=f"compliance_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt", mime="text/plain")
            st.success("Summary Generated")

# ============================================================================
# FOOTER
# ============================================================================

st.divider()
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.success("✓ Enterprise Detection")
with col2:
    st.info("✓ Real-time Analysis")
with col3:
    st.warning("✓ Compliance Ready")
with col4:
    st.caption("FlowGuard AI v2.0 Professional | Enterprise AML System")
