import styles from './App.module.css';
import ProductList from './components/ProductList';

function App() {
  return (
    <div className={styles.container}>
      <h1>Lista produktów</h1>
      <ProductList />
    </div>
  );
}

export default App;
