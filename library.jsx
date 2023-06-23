import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import LibraryContract from './contracts/Library.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    loadWeb3();
    loadContract();
    loadAccount();
    loadBooks();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      setWeb3(window.web3);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      setWeb3(window.web3);
    } else {
      window.alert(
        'Metamask'
      );
    }
  };

  const loadContract = async () => {
    try {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LibraryContract.networks[networkId];
      const contractInstance = new web3.eth.Contract(
        LibraryContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contractInstance);
    } catch (error) {
      console.error('Kitap sözleşmesi yüklenirken bir hata oluştu:', error);
    }
  };

  const loadAccount = async () => {
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Hesap yüklenirken bir hata oluştu:', error);
    }
  };

  const loadBooks = async () => {
    setLoading(true);
    try {
      const bookCount = await contract.methods.bookCount().call();
      const books = [];

      for (let i = 1; i <= bookCount; i++) {
        const book = await contract.methods.books(i).call();
        books.push(book);
      }

      setBooks(books);
    } catch (error) {
      console.error('Kitaplar yüklenirken bir hata oluştu:', error);
    }
    setLoading(false);
  };

  const addBook = async () => {
    try {
      setLoading(true);
      await contract.methods.addBook(title, author).send({ from: account });
      window.alert('Kitap başarıyla eklendi.');
      setTitle('');
      setAuthor('');
      await loadBooks();
    } catch (error) {
      console.error('Kitap eklenirken bir hata oluştu:', error);
    }
    setLoading(false);
  };

 return (
  <div>
    <h1>Kitap Otomasyonu</h1>
    <div>
      <h2>Kitap Ekle</h2>
      <input
        type="text"
        placeholder="Kitap Adı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Yazar"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
        <button onClick={addBook}>Kitap Ekle</button>
    </div>
    <h2>Kitap Listesi</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {books.map((book, index) => (
            <li key={index}>
              <strong>Kitap Adı:</strong> {book.title}, <strong>Yazar:</strong> {book.author}
            </li>
          ))}
        </ul>
      )}
  </div>
);
 }
