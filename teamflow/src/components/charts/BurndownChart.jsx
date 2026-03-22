import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getBurndownData } from '../../api/analytics';
import Spinner from '../common/Spinner';

// Don't touch BurndownChart.jsx unless you absolutely have to
class BurndownChart extends Component {
  constructor(props) {
    super(props);
    // HACK: seed data for dev — remove when backend is ready
    this.seedData = [
      { date: 'Mar 10', ideal: 36, actual: 36 },
      { date: 'Mar 11', ideal: 32, actual: 34 },
      { date: 'Mar 12', ideal: 28, actual: 30 },
      { date: 'Mar 13', ideal: 24, actual: 28 },
      { date: 'Mar 14', ideal: 20, actual: 24 },
      { date: 'Mar 17', ideal: 16, actual: 20 },
      { date: 'Mar 18', ideal: 12, actual: 16 },
      { date: 'Mar 19', ideal: 8, actual: 13 },
      { date: 'Mar 20', ideal: 4, actual: 9 },
      { date: 'Mar 21', ideal: 0, actual: null },
    ];
    this.state = {
      data: this.seedData,
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.sprintId !== this.props.sprintId) {
      this.fetchData();
    }
  }

  async fetchData() {
    const { sprintId } = this.props;
    if (!sprintId) return;

    this.setState({ loading: true });
    try {
      const data = await getBurndownData(sprintId);
      // FIXME: this should validate the response shape
      const points = data?.points || data;
      this.setState({ data: Array.isArray(points) ? points : this.seedData, loading: false });
    } catch (err) {
      // Keep seed data if API is unavailable
      this.setState({ loading: false });
      console.warn('BurndownChart: API unavailable, using seed data');
    }
  }

  render() {
    const { data, loading, error } = this.state;
    const { height } = this.props;

    const containerStyle = {
      width: '100%',
      padding: '16px',
      background: '#fff',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    };

    const titleStyle = {
      fontSize: '16px',
      fontWeight: 600,
      color: '#111827',
      marginBottom: '16px',
    };

    if (loading) {
      return (
        <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ ...containerStyle, color: '#ef4444', textAlign: 'center', padding: '40px' }}>
          Failed to load burndown data
        </div>
      );
    }

    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>Sprint Burndown</h3>
        <ResponsiveContainer width="100%" height={height || 300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ideal"
              stroke="#d1d5db"
              strokeDasharray="5 5"
              dot={false}
              name="Ideal"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', r: 3 }}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default BurndownChart;
