// Stations data
export const stations = [
  { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
  { code: 'SBC', name: 'Bangalore City', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NR' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'CR' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR' },
  { code: 'NAG', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'CR' },
  { code: 'AMD', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', zone: 'NR' },
  { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Punjab', zone: 'NR' },
  { code: 'GHY', name: 'Guwahati Station', city: 'Guwahati', state: 'Assam', zone: 'NFR' },
  { code: 'BBS', name: 'Bhubaneswar Station', city: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR' },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'SR' },
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala', zone: 'SR' },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR' },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', zone: 'NER' },
];

export const popularDestinations = [
  { from: 'New Delhi', to: 'Mumbai', image: 'mumbai', trains: 42, duration: '16h 30m', price: 1200, popular: true },
  { from: 'New Delhi', to: 'Kolkata', image: 'kolkata', trains: 38, duration: '17h 45m', price: 1350, popular: true },
  { from: 'Mumbai', to: 'Goa', image: 'goa', trains: 24, duration: '8h 20m', price: 680, popular: true },
  { from: 'Bangalore', to: 'Chennai', image: 'chennai', trains: 30, duration: '5h 30m', price: 450, popular: true },
  { from: 'Delhi', to: 'Jaipur', image: 'jaipur', trains: 28, duration: '4h 45m', price: 380, popular: true },
  { from: 'Mumbai', to: 'Hyderabad', image: 'hyderabad', trains: 18, duration: '12h 0m', price: 890, popular: true },
];
