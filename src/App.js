import { useState, useEffect } from "react";
import { db } from "./firebaseConnection";
import {
    doc,
    setDoc,
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot,
} from "firebase/firestore";

import "./app.css";

function App() {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [idPost, setIdPost] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function loadPosts() {
            const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
                let listaPost = [];
                snapshot.forEach((doc) => {
                    listaPost.push({
                        id: doc.id,
                        titulo: doc.data().titulo,
                        autor: doc.data().autor,
                    });
                });

                setPosts(listaPost);
            });
        }

        loadPosts();
    }, []);

    async function handleAdd() {
        await addDoc(collection(db, "posts"), {
            titulo: titulo,
            autor: autor,
        })
            .then(() => {
                setAutor("");
                setTitulo("");
            })
            .catch((error) => {
                console.log("Erro ao cadastrar: " + error);
            });
    }

    async function buscarPost() {
        const postsRef = collection(db, "posts");
        await getDocs(postsRef)
            .then((snapshot) => {
                let lista = [];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        titulo: doc.data().titulo,
                        autor: doc.data().autor,
                    });
                });

                setPosts(lista);
            })
            .catch((error) => {
                console.log("erro ao buscar: " + error);
            });
    }

    async function editarPost() {
        const docRef = doc(db, "posts", idPost);

        await updateDoc(docRef, {
            titulo: titulo,
            autor: autor,
        })
            .then(() => {
                alert("Atualizado com sucesso!");
                setIdPost("");
                setTitulo("");
                setAutor("");
            })

            .catch((error) => {
                console.log("Erro ao atualizar: " + error);
            });
    }

    async function excluirPost(id) {
        const docRef = doc(db, "posts", id);

        await deleteDoc(docRef)
            .then(() => {
                alert("Excluído com sucesso!");
                buscarPost();
            })
            .catch((error) => {
                console.log("Erro ao excluir: " + error);
            });
    }

    return (
        <div className="App">
            <h1>Anotações com Firbebase</h1>

            <div className="container">
                <label> ID POST</label>
                <input
                    placeholder="Digite o ID do post"
                    value={idPost}
                    onChange={(e) => setIdPost(e.target.value)}
                />{" "}
                <br />
                <label>Titulo:</label>
                <textarea
                    type="text"
                    placeholder="Digite o título..."
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <label>Autor:</label>
                <input
                    type="text"
                    placeholder="Digite o autor..."
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                />{" "}
                <br />
                <button onClick={handleAdd}>Cadastrar</button>
                <br></br>
                <button onClick={buscarPost}>Buscar Post</button>
                <br />
                <button onClick={editarPost}>Atualizar</button>
                <br />
                <br />
                <div className="listPost">
                    <h2>Posts cadastrados:</h2>
                    <ul>
                        {posts.map((posts) => {
                            return (
                                <li key={posts.id}>
                                    <strong>ID: {posts.id}</strong> <br />
                                    <span>Titulo:{posts.titulo}</span> <br />
                                    <span>Autor:{posts.autor}</span>
                                    <br />
                                    <button
                                        onClick={() => excluirPost(posts.id)}
                                    >
                                        Excluir
                                    </button>{" "}
                                    <br />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
