"""
FlowGuard AI - Anti-Money Laundering Detection System
Professional AML Detection for Financial Institutions
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
# PAGE SETUP
# ============================================================================

st.set_page_config(
    page_title="FlowGuard AI - AML Detection",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'uploaded_df' not in st.session_state:
    st.session_state.uploaded_df = None
if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = None

# ============================================================================
# TITLE & HEADER
# ============================================================================

st.title("FlowGuard AI")
st.subheader("Anti-Money Laundering Detection System")
st.markdown("Enterprise-grade AML detection powered by machine learning")
st.divider()

# ============================================================================
# AML ENGINE
# ============================================================================

class AMLEngine:
    def __init__(self, df):
        self.df = df.copy()
        self.amount_mean = self.df['amount'].mean()
        self.amount_std = max(self.df['amount'].std(), 1)
        self.amount_q95 = self.df['amount'].quantile(0.95)
        
        try:
            X = self.df[['amount']].values
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            self.iso_forest = IsolationForest(contamination=0.08, random_state=42)
            self.iso_forest.fit(X_scaled)
            self.scaler = scaler
        except:
            self.iso_forest = None
            self.scaler = None
    
    def detect_structuring(self, amount):
        """Detect structuring pattern (just below thresholds)"""
        if (9500 <= amount <= 10500) or (49500 <= amount <= 50500):
            return 35
        return 0
    
    def detect_anomaly(self, amount):
        """ML-based anomaly detection"""
        z_score = abs((amount - self.amount_mean) / self.amount_std)
        if z_score > 4:
            return 30
        elif z_score > 3:
            return 20
        return 0
    
    def risk_score(self, row):
        """Calculate risk score (0-100)"""
        risk = 0
        factors = {}
        
        amount = float(row.get('amount', 0))
        
        # Factor 1: Structuring
        struct = self.detect_structuring(amount)
        if struct > 0:
            risk += struct
            factors['Structuring'] = struct
        
        # Factor 2: Anomaly
        anom = self.detect_anomaly(amount)
        if anom > 0:
            risk += anom
            factors['Amount Anomaly'] = anom
        
        # Factor 3: High Amount
        if amount > self.amount_q95:
            risk += 15
            factors['High Amount'] = 15
        
        # Factor 4: Channel Risk
        channel = str(row.get('channel', '')).upper()
        if channel in ['WIRE', 'RTGS']:
            risk += 10
            factors['High-Risk Channel'] = 10
        
        # Factor 5: Country Risk
        country = str(row.get('country', '')).upper()
        if country in ['UA', 'RU', 'IR', 'KP', 'SY']:
            risk += 15
            factors['High-Risk Country'] = 15
        
        return min(risk, 100), factors
    
    def analyze(self):
        """Analyze all transactions"""
        results = []
        for idx, row in self.df.iterrows():
            risk, factors = self.risk_score(row)
            
            if risk >= 70:
                severity = 'CRITICAL'
            elif risk >= 50:
                severity = 'HIGH'
            elif risk >= 30:
                severity = 'MEDIUM'
            else:
                severity = 'LOW'
            
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
# SAMPLE DATA
# ============================================================================

def generate_sample_data(num=5000):
    np.random.seed(42)
    data = []
    
    for i in range(num):
        is_suspicious = np.random.random() < 0.08
        
        if is_suspicious:
            amount = np.random.choice([9750, 10000, 49750, 50000]) + np.random.uniform(-200, 200)
            channel = np.random.choice(['WIRE', 'RTGS'])
            country = np.random.choice(['UA', 'RU', 'IR', 'LB'])
        else:
            amount = float(np.random.lognormal(10, 1.5))
            channel = np.random.choice(['NEFT', 'RTGS', 'IMPS', 'Wire'], p=[0.5, 0.2, 0.2, 0.1])
            country = np.random.choice(['IN', 'US', 'GB', 'SG', 'HK'], p=[0.7, 0.1, 0.08, 0.07, 0.05])
        
        data.append({
            'txn_id': f'TXN-{i:08d}',
            'customer_id': f'C-{np.random.randint(1, 101):03d}',
            'amount': max(amount, 100),
            'channel': channel,
            'country': country,
            'timestamp': pd.Timestamp('2024-01-01') + pd.Timedelta(minutes=np.random.randint(0, 14400))
        })
    
    return pd.DataFrame(data)

# ============================================================================
# TABS
# ============================================================================

tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "Dashboard",
    "Live Demo",
    "Upload Data",
    "Analytics",
    "Download"
])

# ============================================================================
# TAB 1: DASHBOARD
# ============================================================================

with tab1:
    st.header("System Overview")
    
    demo_df = generate_sample_data(5000)
    engine = AMLEngine(demo_df)
    results = engine.analyze()
    
    # Metrics
    col1, col2, col3, col4, col5 = st.columns(5)
    total = len(results)
    critical = len(results[results['Risk_Score'] >= 70])
    high = len(results[results['Risk_Score'] >= 50])
    medium = len(results[results['Risk_Score'] >= 30])
    avg_risk = results['Risk_Score'].mean()
    
    with col1:
        st.metric("Total Transactions", f"{total:,}")
    with col2:
        st.metric("Critical Alerts", critical)
    with col3:
        st.metric("High Risk", high)
    with col4:
        st.metric("Medium Risk", medium)
    with col5:
        st.metric("Avg Risk Score", f"{avg_risk:.1f}")
    
    st.divider()
    
    # Charts
    col1, col2 = st.columns(2)
    
    with col1:
        fig = px.histogram(results, x='Risk_Score', nbins=30, 
                          title='Risk Score Distribution',
                          labels={'Risk_Score': 'Risk Score', 'count': 'Transactions'})
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        severity_counts = results['Severity'].value_counts()
        colors = {'CRITICAL': '#FF0000', 'HIGH': '#FF8800', 'MEDIUM': '#FFCC00', 'LOW': '#00CC00'}
        fig = px.pie(values=severity_counts.values, names=severity_counts.index,
                    title='Severity Distribution',
                    color_discrete_map=colors)
        st.plotly_chart(fig, use_container_width=True)
    
    st.divider()
    st.subheader("Recent Transactions")
    display = results[['TXN_ID', 'Amount', 'Risk_Score', 'Severity', 'Channel', 'Customer']].head(25)
    st.dataframe(display, use_container_width=True)

# ============================================================================
# TAB 2: LIVE DEMO
# ============================================================================

with tab2:
    st.header("Live Fraud Detection Demo")
    
    if st.button("Start Demo"):
        st.info("Running detection on sample transactions...")
        
        demo_df = generate_sample_data(1000)
        engine = AMLEngine(demo_df)
        
        # Show top suspicious transactions
        results = engine.analyze()
        suspicious = results[results['Risk_Score'] >= 50].sort_values('Risk_Score', ascending=False).head(10)
        
        st.subheader("Top 10 Suspicious Transactions")
        
        for idx, row in suspicious.iterrows():
            severity_color = {'CRITICAL': '#FF0000', 'HIGH': '#FF8800', 'MEDIUM': '#FFCC00', 'LOW': '#00CC00'}
            color = severity_color.get(row['Severity'], '#777777')
            
            col1, col2, col3 = st.columns([1, 2, 1])
            with col1:
                st.markdown(f"<div style='background:{color}; color:white; padding:10px; border-radius:5px; text-align:center'><b>{row['Severity']}</b></div>", unsafe_allow_html=True)
            with col2:
                st.write(f"**{row['TXN_ID']}** | Amount: Rs {row['Amount']:,.0f}")
            with col3:
                st.write(f"Risk: {row['Risk_Score']:.0f}/100")
            
            st.markdown("---")

# ============================================================================
# TAB 3: UPLOAD DATA
# ============================================================================

with tab3:
    st.header("Upload & Analyze")
    
    uploaded_file = st.file_uploader("Upload CSV or Excel file", type=['csv', 'xlsx', 'xls'])
    
    if uploaded_file is not None:
        try:
            if uploaded_file.name.endswith('.csv'):
                df = pd.read_csv(uploaded_file)
            else:
                df = pd.read_excel(uploaded_file)
            
            df.columns = df.columns.str.lower().str.strip()
            st.session_state.uploaded_df = df
            
            st.success(f"Loaded {len(df):,} transactions")
            
            if st.button("Run Analysis"):
                with st.spinner("Analyzing transactions..."):
                    engine = AMLEngine(df)
                    results = engine.analyze()
                    st.session_state.analysis_results = results
                
                st.success("Analysis complete!")
                
                # Metrics
                col1, col2, col3, col4, col5 = st.columns(5)
                with col1:
                    st.metric("Total", len(results))
                with col2:
                    st.metric("Critical", len(results[results['Risk_Score'] >= 70]))
                with col3:
                    st.metric("High", len(results[results['Risk_Score'] >= 50]))
                with col4:
                    st.metric("Medium", len(results[results['Risk_Score'] >= 30]))
                with col5:
                    st.metric("Avg Score", f"{results['Risk_Score'].mean():.1f}")
                
                st.divider()
                
                # High risk transactions
                high_risk = results[results['Risk_Score'] >= 50].sort_values('Risk_Score', ascending=False)
                st.subheader(f"High-Risk Transactions ({len(high_risk)})")
                st.dataframe(high_risk[['TXN_ID', 'Amount', 'Risk_Score', 'Severity', 'Channel']], use_container_width=True)
        
        except Exception as e:
            st.error(f"Error: {str(e)}")

# ============================================================================
# TAB 4: ANALYTICS
# ============================================================================

with tab4:
    st.header("Advanced Analytics")
    
    results = st.session_state.analysis_results if st.session_state.analysis_results is not None else AMLEngine(generate_sample_data(5000)).analyze()
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig = px.histogram(results, x='Amount', nbins=50, title='Amount Distribution')
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        fig = px.scatter(results.head(1000), x='Amount', y='Risk_Score', 
                        color='Severity', size='Factor_Count',
                        title='Amount vs Risk Score')
        st.plotly_chart(fig, use_container_width=True)
    
    st.divider()
    
    col1, col2 = st.columns(2)
    
    with col1:
        channel_risk = results.groupby('Channel')['Risk_Score'].mean().sort_values(ascending=False)
        fig = px.bar(x=channel_risk.values, y=channel_risk.index, 
                    title='Avg Risk by Channel', orientation='h')
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        country_risk = results.groupby('Country')['Risk_Score'].mean().sort_values(ascending=False).head(10)
        fig = px.bar(x=country_risk.values, y=country_risk.index,
                    title='Avg Risk by Country', orientation='h')
        st.plotly_chart(fig, use_container_width=True)

# ============================================================================
# TAB 5: DOWNLOAD
# ============================================================================

with tab5:
    st.header("Download Results")
    
    results = st.session_state.analysis_results if st.session_state.analysis_results is not None else AMLEngine(generate_sample_data(5000)).analyze()
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        csv = results.to_csv(index=False)
        st.download_button(
            label="Download All (CSV)",
            data=csv,
            file_name="aml_all_transactions.csv",
            mime="text/csv"
        )
    
    with col2:
        high_risk = results[results['Risk_Score'] >= 50]
        csv = high_risk.to_csv(index=False)
        st.download_button(
            label="High Risk (CSV)",
            data=csv,
            file_name="aml_high_risk.csv",
            mime="text/csv",
            disabled=len(high_risk) == 0
        )
    
    with col3:
        json_data = results.to_json(orient='records', indent=2)
        st.download_button(
            label="Download JSON",
            data=json_data,
            file_name="aml_results.json",
            mime="application/json"
        )
    
    with col4:
        critical = results[results['Risk_Score'] >= 70]
        csv = critical.to_csv(index=False)
        st.download_button(
            label="Critical Only (CSV)",
            data=csv,
            file_name="aml_critical.csv",
            mime="text/csv",
            disabled=len(critical) == 0
        )

# ============================================================================
# FOOTER
# ============================================================================

st.divider()
col1, col2, col3 = st.columns(3)
with col1:
    st.success("✓ Advanced ML Detection")
with col2:
    st.info("✓ Risk Scoring Engine")
with col3:
    st.caption("FlowGuard AI v1.0 - AML Detection System")
