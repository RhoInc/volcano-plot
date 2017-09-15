export default function search(value) {
    this.parent.data.searched =
        value !== ''
            ? this.parent.data.clean.filter(d => {
                  let match = false;

                  for (const variable of this.selected.variables) {
                      if (match === false) {
                          match = d[variable.value_col].toLowerCase().indexOf(value) > -1;
                          if (match) break;
                      }
                  }

                  return match;
              })
            : [];
    delete this.selected.clicked;
    this.drawSelected(this.parent.data.searched);
    this.drawDetails();
}
