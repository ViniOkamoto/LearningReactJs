import React, { Component } from 'react';

import {
  FaGithubAlt,
  FaPlus,
  FaSpinner,
  FaSearch,
  FaTrashAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import api from '../../services/api';

import { Form, SubmitButton, DetailButton, DeleteButton, List } from './styles';
import Container from '../../components/Container/index';
import 'react-toastify/dist/ReactToastify.css';

class Main extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: null,
    // loading will deactive the button while the reposotorie isn't loaded
  };

  // load data from localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // save data from localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value, error: null });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true, error: false });
    const { newRepo, repositories } = this.state;

    if (newRepo === '') {
      toast.error('Você precisa indicar um repositório');
      this.setState({ error: true, loading: false });
      return null;
    }

    if (repositories.find(i => i.name === newRepo)) {
      toast.error('Este repositório já está listado!');
      this.setState({ error: true, loading: false });
      return null;
    }

    const response = await api
      .get(`/repos/${newRepo}`)
      .then(result => {
        const data = {
          name: result.data.full_name,
        };
        this.setState({
          repositories: [...repositories, data],
          newRepo: '',
          loading: false,
        });
        toast.success('O repositório foi adicionado a lista');
      })
      .catch(() => {
        toast.error('Este repositório não existe!');
        this.setState({ error: true, loading: false });
      });
    return response;
  };

  remove(name) {
    const { repositories } = this.state;
    this.setState({
      repositories: repositories.filter(el => name !== el.name),
    });
  }

  render() {
    const { newRepo, repositories, loading, error } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <ToastContainer />
        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>

              {/*
               * When we need to concatenate the url, like this case, we use the
               * encodeURIComponent()
               */}
              <div>
                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                  <DetailButton>
                    <FaSearch color="#000" />
                  </DetailButton>
                </Link>
                <DeleteButton
                  onClick={() => {
                    this.remove(repository.name);
                    const getLSRepo = localStorage.getItem('repositories');
                    const getLSRepoNameArr = JSON.parse(getLSRepo);
                    for (let i = 0; i < getLSRepoNameArr.length; i += 1) {
                      if (getLSRepoNameArr[i].name === repository.name) {
                        getLSRepoNameArr.splice(i, 1);
                        localStorage.setItem(
                          'repositories',
                          JSON.stringify(getLSRepoNameArr)
                        );
                      }
                    }
                  }}
                >
                  <FaTrashAlt />
                </DeleteButton>
              </div>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
