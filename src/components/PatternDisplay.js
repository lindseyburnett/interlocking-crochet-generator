import React from "react";
import "./PatternDisplay.scss";
import { getPatternRow, getRowColor, getRowSide } from "../utils/pattern-utils";

export default function PatternDisplay(props) {
	const grid = props.grid;
	const rows = grid.length;
	const cols = grid[0].length;
	const steps = [];

	// need to pull this into a separate function to stay DRY, since we loop in two different directions for RS vs. WS
	const getStitch = (row, col, currentColor, currentSide) => {
		let gridValue = grid[row][col];

		if(currentColor === "BG" && (col === 0 || col === cols-1)) return "ss";

		if(currentSide === "RS" && currentColor === "FG" && row === rows-3) {
			if(col === cols-2) {
				return `The active loop of the FG chain should be on the ${gridValue ? "FRONT" : "BACK"} side of the BG mesh. `;
			} else if(col === cols-4) {
				return `DC in the 6th ch from the hook on the ${gridValue ? "FRONT" : "BACK"} side of the mesh. Then: `;
			}			
		}

		if(currentSide === "WS") gridValue = !gridValue;
		if(currentColor === "FG") {
			return gridValue ? "f" : "b";
		} else {
			return gridValue ? "b" : "f";
		}
	};

	// start with the 2nd row from the bottom, which is special since you have to thread the FG chain
	let chainSetup = `With FG, ch ${cols-2}+3. `;
	const setupInFront = grid[rows-3][cols-2];
	chainSetup += `Place the chain ${setupInFront ? "on top of" : "behind"} the BG mesh, so that the end closest to your hook is in the ${setupInFront ? "front" : "back"}. `;
	chainSetup += "Going from right to left, weave the tail of the chain in and out of the ch spaces in the BG mesh, so that it lays in the front or back of the BG dcs in this order: ";
	const chainSteps = [];
	for(let i = cols-3; i >= 2; i -= 2) {
		chainSteps.push(grid[rows-2][i] ? "front" : "back");
	}

	// convert to display string
	const repeats = parseRepeats(chainSteps);
	for(let i = 0; i < repeats.length; i++) {
		const repeat = repeats[i];
		if(repeat.length === 1) {
			chainSetup += repeat[0];
		} else {
			chainSetup += `${repeat[0]} x ${repeat.length}`;
		}

		if(i === repeats.length-1) chainSetup += ".";
		else chainSetup += ", ";
	}

	// continue looping through rows from bottom up
	for(let i = rows - 3; i >= 0; i--) {
		const currentRow = getPatternRow(i, rows);
		const currentColor = getRowColor(currentRow);
		const currentSide = getRowSide(currentRow);

		// loop through stitches for this row going from right to left, 2 stitches at a time
		// if we're on the WS, the work is flipped over, so we go left to right then instead
		// if it's the FG, we start and end one stitch inwards, since the outer will always be the BG's side stitch
		const stitches = [];
		if(currentSide === "RS") {
			const start = currentColor === "BG" ? cols-1 : cols-2;
			const end = currentColor === "BG" ? 0 : 1;
			for(let j = start; j >= end; j -= 2) {
				stitches.push(getStitch(i, j, currentColor, currentSide))
			}
		} else {
			const start = currentColor === "BG" ? 0 : 1;
			const end = currentColor === "BG" ? cols-1 : cols-2;
			for(let j = start; j <= end; j += 2) {
				stitches.push(getStitch(i, j, currentColor, currentSide));
			}
		}

		// parse out times where the same stitch is listed multiple times in a row
		const repeats = parseRepeats(stitches);

		// convert everything into the final string to display
		let stepStr = "";
		for(let j = 0; j < repeats.length; j++) {
			const repeat = repeats[j];
			if(repeat.length === 1) {
				stepStr += repeat[0];
			} else {
				stepStr += `${repeat[0]}x${repeat.length}`;
			}

			// don't add extra punctuation to the custom sentences shown on the first FG row
			if(repeat[0] === "f" || repeat[0] === "b" || repeat[0] === "ss") {
				if(j === repeats.length-1) stepStr += ".";
				else stepStr += ", ";
			}
		}

		if(currentColor === "FG" && i !== 0) stepStr += " Turn.";

		steps.push({
			currentRow: currentRow,
			currentColor: currentColor,
			currentSide: currentSide,
			stepStr: stepStr
		});
	}

	// add "move FG to the back/front" info
	for(let i = 0; i < steps.length; i++) {
		const step = steps[i];
		if(step.currentColor === "FG" || i === steps.length-1) { // second check should never happen but JIC
			step.moveFGTo = null;
		} else {
			step.moveFGTo = steps[i+1].stepStr.charAt(0) === "f" ? "front" : "back";
		}
	}

	return (
		<div className="PatternDisplay">
			<div className="PatternDisplay__aside">
				<strong>Abbreviations:</strong>
				<ul>
					<li>
						BG - background color
						<div className="PatternDisplay__color-block  PatternDisplay__color-block--bg"></div>
					</li>
					<li>
						FG - foreground color
						<div className="PatternDisplay__color-block  PatternDisplay__color-block--fg"></div>
					</li>
					<li>RS - right side/front of work</li>
					<li>WS - wrong side/back of work</li>
					<li>dc - double crochet</li>
					<li>ch - chain</li>
					<li>f - dc stitch to the front</li>
					<li>b - dc stitch to the back</li>
					<li>ss - side stitch (always BG; ch 3 if at start of row, or dc if at end)</li>
					<li>fx3 - make 3 front stitches</li>
				</ul>
			</div>
			
			<div className="PatternDisplay__step">
				<strong>Row 0/Initial setup</strong>
				<p>With BG, ch {cols}+3, then dc into 6th ch from hook. *Ch 1, skip ch, dc in next ch* Repeat from * to *, ending with dc in the last ch. Set aside.</p>
				<p>{chainSetup}</p>
				<p>From here on, always ch 1 and skip a stitch between each dc.</p>
			</div>
			{steps.map(step => (
				<div className="PatternDisplay__step" key={step.currentRow}>
					<strong>Row {step.currentRow} - {step.currentColor} - {step.currentSide}</strong>
					<p>{step.moveFGTo && `Move FG to ${step.moveFGTo}, then `}{step.stepStr}</p>
				</div>
			))}
		</div>
	);
}

function parseRepeats(stitches) {
	const repeats = [];
	for(let j = 0; j < stitches.length; j++) {
		if(j === 0 || stitches[j] !== stitches[j-1]) {
			repeats.push([stitches[j]]);
		} else {
			repeats[repeats.length-1].push(stitches[j]);
		}
	}

	return repeats;
}