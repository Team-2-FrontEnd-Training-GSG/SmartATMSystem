const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    borderTop: '5px solid #007bff',
  },
  header: {
    marginBottom: '30px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#dc3545',
    marginTop: '15px',
    fontWeight: 'bold',
  },
  link: {
    marginTop: '25px',
    fontSize: '14px',
  },
};

export default styles;