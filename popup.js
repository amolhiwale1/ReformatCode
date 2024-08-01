document.getElementById('formatButton').addEventListener('click', formatCode);
document.getElementById('copyButton').addEventListener('click', copyToClipboard);

function formatCode() {
    const inputCode = document.getElementById('inputCode').value;
    const formattedCode = reformatCode(inputCode);
    document.getElementById('outputCode').value = formattedCode;
    document.getElementById('copyMessage').innerText = ''; // Clear the copy message when new code is formatted
}

function reformatCode(code) {
    // Regular expression to match a method body and ensure return is the first statement after the opening brace or after a method call ending with );
    const methodRegex = /(\s*public\s+[^{]+{)([^{}]*)(\s*return\s+[^;]+;)((.|\n)*?)\s*}/g;
    return code.replace(methodRegex, (_, methodSignature, preReturnPart, returnStatement) => {
        // Check if already formatted
        if (returnStatement.includes('customUiMainMacroponent().createByCss') ||
            returnStatement.includes('customUiDropDownSeismicHoist().createByCss') ||
            returnStatement.includes('customUiMainMacroponent().createAllByCss')) {
            return `${methodSignature}${preReturnPart}${returnStatement}\n}`;
        }

        // Extract content after 'return'
        const afterReturn = returnStatement.split('return ')[1].trim();
        let finalLine = '';

        if (afterReturn.includes('seismicHoist_shadowRoot')) {
            finalLine = afterReturn.replace(/\.shadowRootCreateByCss/g, '.createByCss')
                .replace('seismicHoist_shadowRoot()', 'customUiDropDownSeismicHoist()');
        } else if (afterReturn.includes('.shadowRootCreateAllByCss')) {
            const classAndSelector = afterReturn.split('.shadowRootCreateAllByCss')[1];
            finalLine = `customUiMainMacroponent().createAllByCss${classAndSelector}`;
        } else {
            const classAndSelector = afterReturn.split('.shadowRootCreateByCss')[afterReturn.split('.shadowRootCreateByCss').length - 1];
            finalLine = `customUiMainMacroponent().createByCss${classAndSelector}`;
        }

        // Ensure no extra semicolon at the end and remove unnecessary new lines
        const preReturnPartClean = preReturnPart.trim() ? `${preReturnPart.trim()}\n` : '';
        return `${methodSignature.trim()}\n${preReturnPartClean}    return ${finalLine.replace(/;$/, '')};\n}`;
    });
}

function copyToClipboard() {
    const outputCode = document.getElementById('outputCode');
    outputCode.select();
    document.execCommand('copy');
    document.getElementById('copyMessage').innerText = 'Copied to clipboard';
}
