import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }

  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as",
      "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these",
      "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you",
      "your", "yours", "he", "him", "his", "she", "her", "hers", "was", "were",
      "is", "am", "are", "be", "been", "being", "have", "has", "had", "doing",
      "do", "did", "doesn't", "don't", "didn't", "wasn't", "weren't", "won't",
      "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "isn't",
      "aren't"
    ]);

    const words = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ");

    const filteredWords = words.filter((word) => word && !stopWords.has(word));

    const frequency = filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {});

    return Object.entries(frequency);
  };

  handleGenerate = () => {
    const input_data = document.getElementById("input_field").value;
    const wordFrequency = this.getWordFrequency(input_data);
    this.setState({ wordFrequency }, () => {
      this.renderChart();
    });
  };

  renderChart() {
    const data = [...this.state.wordFrequency]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (data.length === 0) return;

    const fontSizeScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d[1]), d3.max(data, (d) => d[1])])
      .range([20, 50]);

    const svg = d3
      .select(".svg_parent")
      .attr("width", 1000)
      .attr("height", 200);

    const texts = svg.selectAll("text").data(data, (d) => d[0]);

    texts
      .exit()
      .transition()
      .duration(1000)
      .attr("font-size", 0)
      .style("opacity", 0)
      .remove();

    texts
      .transition()
      .duration(1000)
      .attr("x", (d, i) => 50 + i * 150)
      .attr("font-size", (d) => fontSizeScale(d[1]));

    texts
      .enter()
      .append("text")
      .attr("x", (d, i) => 50 + i * 150)
      .attr("y", 100)
      .attr("font-size", 0)
      .attr("fill", "black")
      .style("font-family", "Times New Roman")
      .text((d) => d[0])
      .transition()
      .duration(3000)
      .attr("font-size", (d) => fontSizeScale(d[1]));

    svg
      .selectAll("text")
      .data(data, (d) => d[0])
      .transition()
      .duration(1000)
      .attr("x", (d, i) => 50 + i * 150)
      .attr("font-size", (d) => fontSizeScale(d[1]));
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea
            id="input_field"
            style={{ height: 150, width: 1000 }}
          />
          <button
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={this.handleGenerate}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
