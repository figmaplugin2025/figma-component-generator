import React, { useState } from 'react';
import { listComponentKeys, getComponentByName } from '../utils/figmaApiHelper';

const FigmaApiHelper: React.FC = () => {
  const [fileKey, setFileKey] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleListComponents = async () => {
    if (!fileKey || !accessToken) {
      setResult('Please enter both File Key and Access Token');
      return;
    }

    setLoading(true);
    setResult('Loading components...');

    try {
      // We'll use console.log for now since we can't directly call the API from the plugin UI
      // In a real implementation, you'd call this from a backend service
      console.log('To get component keys, run this in your browser console:');
      console.log(`listComponentKeys('${fileKey}', '${accessToken}')`);
      
      setResult(`
✅ Instructions:
1. Open your browser console (F12)
2. Run: listComponentKeys('${fileKey}', '${accessToken}')
3. Copy the component keys from the console output
4. Update your sampleData.ts file with the real keys
      `);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetComponentByName = async () => {
    if (!fileKey || !accessToken) {
      setResult('Please enter both File Key and Access Token');
      return;
    }

    const componentName = prompt('Enter `component` name:');
    if (!componentName) return;

    setLoading(true);
    setResult('Searching for component...');

    try {
      console.log('To get a specific component, run this in your browser console:');
      console.log(`getComponentByName('${fileKey}', '${accessToken}', '${componentName}')`);
      
      setResult(`
✅ Instructions:
1. Open your browser console (F12)
2. Run: getComponentByName('${fileKey}', '${accessToken}', '${componentName}')
3. Copy the component key from the console output
      `);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      margin: '10px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🔑 Figma API Helper - Get Component Keys</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          File Key:
        </label>
        <input
          type="text"
          value={fileKey}
          onChange={(e) => setFileKey(e.target.value)}
          placeholder="e.g., abc123def456"
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
        />
        <small style={{ color: '#666' }}>
          Get this from your Figma file URL: https://www.figma.com/file/XXXXX/...
        </small>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Access Token:
        </label>
        <input
          type="password"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Your Figma access token"
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
        />
        <small style={{ color: '#666' }}>
          Get this from: Figma → Settings → Account → Personal access tokens
        </small>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={handleListComponents}
          disabled={loading}
          style={{ 
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'List All Components'}
        </button>
        
        <button
          onClick={handleGetComponentByName}
          disabled={loading}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#34C759',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Find Component by Name'}
        </button>
      </div>

      {result && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: 'white', 
          border: '1px solid #ddd',
          borderRadius: '4px',
          whiteSpace: 'pre-line'
        }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h4>📋 How to Get Access Token:</h4>
        <ol style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Go to Figma → Settings → Account</li>
          <li>Scroll down to "Personal access tokens"</li>
          <li>Click "Generate new token"</li>
          <li>Give it a name (e.g., "Plugin Development")</li>
          <li>Copy the token (you won't see it again!)</li>
        </ol>
      </div>
    </div>
  );
};

export default FigmaApiHelper; 