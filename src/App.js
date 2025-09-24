import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
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

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import "./app.css";

function App() {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [idPost, setIdPost] = useState("");

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [user, setUser] = useState(false);
    const [userDetail, setUserDetail] = useState([]);

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

        await deleteDoc(docRef).then(() => {
            alert("Excluído com sucesso!");
            buscarPost();
        });
    }

    async function novoUsuario() {
        await createUserWithEmailAndPassword(auth, email, senha)
            .then((value) => {
                alert("Usuário cadastrado com sucesso!");
                setEmail("");
                setSenha("");
            })
            .catch((error) => {
                if (error.code === "auth/weak-password") {
                    alert("Senha muito fraca.");
                } else if (error.code === "auth/email-already-in-use") {
                    alert("Email já cadastrado.");
                }
            });
    }

    async function logarUsuario() {
        await signInWithEmailAndPassword(auth, email, senha)
            .then((value) => {
                alert("Bem vindo(a): " + value.user.email);

                setUserDetail({
                    uid: value.user.uid,
                    email: value.user.email,
                });
                setUser(true);
                setEmail("");
                setSenha("");
            })

            .catch((error) => {
                if (error.code === "auth/wrong-password") {
                    alert("Senha incorreta.");
                } else if (error.code === "auth/user-not-found") {
                    alert("Usuário não encontrado.");
                } else {
                    alert("Erro ao tentar logar: " + error.code);
                }
            });
    }

    async function fazerLogout() {
        await signOut(auth);
        setUser(false);
        setUserDetail({});
        alert("Você saiu da aplicação!");
    }

    return (
        <div className="App">
            <h1>Anotações com Firbebase</h1>

            {user && (
                <div>
                    <strong>Seja bem vindo(a): {userDetail.uid} </strong> <br />
                    <button onClick={fazerLogout}>Sair</button> <br />
                </div>
            )}

            <div className="container">
                <h2>Usuario</h2>
                <label>Email</label>
                <input
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />{" "}
                <br />
                <label>Senha</label>
                <input
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />{" "}
                <br />
                <button onClick={novoUsuario}>Cadastrar</button> <br />
                <button onClick={logarUsuario}>Login</button>
            </div>
            <br />
            <br />
            <hr />

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
