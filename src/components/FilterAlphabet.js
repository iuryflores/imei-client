import React from "react";

function FilterAlphabet({
  alphabetList,
  selectedAlphabet,
  onAlphabetChange,
  handleClickHash,
}) {
  const handleAlphabetClick = (alphabet) => {
    onAlphabetChange(alphabet);
  };

  return (
    <div className="d-flex">
      <button
        className="button-filter btn"
        onClick={handleClickHash}
        style={{ backgroundColor: "lightgrey" }}
      >
        Tudo
      </button>
      {alphabetList.map((alphabet) => (
        <button
          className="button-filter btn"
          key={alphabet}
          onClick={() => handleAlphabetClick(alphabet)}
          style={{
            fontWeight: alphabet === selectedAlphabet ? "bold" : "normal",
            backgroundColor:
              alphabet === selectedAlphabet ? "black" : "lightgrey",
            color: alphabet === selectedAlphabet ? "white" : "black",
          }}
        >
          {alphabet}
        </button>
      ))}
    </div>
  );
}

export default FilterAlphabet;
