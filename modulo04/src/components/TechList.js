import React, { Component } from 'react';
import TechItem from './TechItem';
class Techlist extends Component {
  /*
  Outro uso de defaultprops ou proptypes

  static defaultProps = {
    tech: 'oculto';
  }

  static propTypes = {
      tech: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  }
  */
  state = {
    newTech: '',
    techs: []
  };
  //Executado assim que o componente aparece em tela
  componentDidMount() {
    const techs = localStorage.getItem('techs');
    if (techs) {
      this.setState({ techs: JSON.parse(techs) });
    }

  }
  //Executado sempre que houver alterações nas props ou estado
  componentDidUpdate(_, prevState) {
    // this.props, this.state a gente consegue acessar esses comandos toda vez que ocorre alguma atualização.
    if (prevState.techs !== this.state.techs) {
      localStorage.setItem('techs', JSON.stringify(this.state.techs))
    }
  }
  // Executado quando o componente deixa de existir
  componentWillMount() {

  }
  handleInputChange = e => {
    this.setState({ newTech: e.target.value });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      techs: [... this.state.techs, this.state.newTech],
      newTech: '',
    })
  }
  handleDelete = (tech) => {
    this.setState({ techs: this.state.techs.filter(t => t !== tech) })
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ul>
          {this.state.techs.map(tech => (
            <TechItem
              key={tech}
              tech={tech}
              onDelete={() => this.handleDelete(tech)} />
          ))}
        </ul>
        <input
          type="text"
          onChange={this.handleInputChange}
          value={this.state.newTech}
        />
        <button type="submit">Enviar</button>
      </form>
    );
  }
}

export default Techlist;