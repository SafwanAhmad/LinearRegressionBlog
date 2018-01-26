// cb_obj is the Bokeh slider whose value was changed
var slider_value = cb_obj.value;
var title = cb_obj.title;


div_id_cost_plot = div_ids.data['div_id_cost_plot']
div_id_line_plot = div_ids.data['div_id_line_plot']

cost_plot = document.getElementById(div_id_cost_plot)
cost_data = cost_plot.data
line_plot = document.getElementById(div_id_line_plot)
line_data = line_plot.data

// Get the line & sphere objects
line = line_data[1]
sphere = cost_data[1]

x_end_points = line['x']
y_end_points = line['y']

old_slope = (y_end_points[1] - y_end_points[0])/(x_end_points[1] - x_end_points[0] + 0.000001)
old_intercept = y_end_points[1] - old_slope * x_end_points[1]
                                                 
if (title == "Slope")
{
    slider_value = Math.tan(slider_value*Math.PI/180)
    new_slope = slider_value
    new_intercept = old_intercept
    console.log("Slope changed")
}
else
{
    new_slope = old_slope
    new_intercept = slider_value
    console.log("Intercept changed")
}

y_end_points[0] = new_slope * x_end_points[0] + new_intercept
y_end_points[1] = new_slope * x_end_points[1] + new_intercept


cost_coeffs = cost_coeffs.data

coeff_constant = cost_coeffs['1'][0]
coeff_c_squared = cost_coeffs['c**2'][0]
coeff_m_squared = cost_coeffs['m**2'][0]
coeff_c = cost_coeffs['c'][0]
coeff_m = cost_coeffs['m'][0]
coeff_m_c = cost_coeffs['c*m'][0]

old_cost = coeff_constant + coeff_c_squared * old_intercept * old_intercept 
                          + coeff_m_squared * old_slope     * old_slope 
                          + coeff_c * old_intercept
                          + coeff_m * old_slope
                          + coeff_m_c * old_slope * old_intercept


new_cost = coeff_constant + coeff_c_squared * new_intercept * new_intercept 
                          + coeff_m_squared * new_slope     * new_slope 
                          + coeff_c * new_intercept
                          + coeff_m * new_slope
                          + coeff_m_c * new_slope * new_intercept

console.log(line)

nb_rows = sphere['x'].length
nb_cols = sphere['x'][0].length

for(i=0; i<nb_rows; i++){
    for(j=0; j<nb_cols; j++){
        sphere['x'][i][j] = sphere['x'][i][j] - old_slope + new_slope
        sphere['y'][i][j] = sphere['y'][i][j] - old_intercept + new_intercept
        sphere['z'][i][j] = sphere['z'][i][j] - old_cost + new_cost
    }
}

Plotly.restyle(line_plot, {data:line_data})
Plotly.restyle(cost_plot, {data:cost_data})
