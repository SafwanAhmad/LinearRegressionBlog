var f = cb_obj.value;
    data = source1.data
    
    x = data['x']
    y = data['y']
    x_min = x[0]
    x_max = x[1]
    y_min = y[0]
    y_max = y[1]
    
    var title = cb_obj.title;
    var slope = (y_max - y_min)/(x_max - x_min + 0.00001);
    var intercept = y_min - slope * x_min;

    
    if (title == "Slope")
    {
        y[0] = Math.tan(f) * x[0] + intercept;
        y[1] = Math.tan(f) * x[1] + intercept;
    }
    else
    {
        y[0] = slope * x[0] + f;
        y[1] = slope * x[1] + f;
    }
    
    // Update the cost plot which is actually a Plotly
    // plot through ugly DOM / javascript hacking.
    
    var update = {
    title: 'some new title'};
    
    var id = document.getElementsByClassName('plotly-graph-div js-plotly-plot')[0].id
    
    var plotDiv = document.getElementById(id);
    var plotData = plotDiv.data;
    
    var cost_data = plotData[0]
    var sphere_data = plotData[1]
    
    
    cost_coeffs = source2.data['coeffs'];
    sphere = source3.data['sphere'];
    
    c_square = cost_coeffs[0]
    m_square = cost_coeffs[1]
    c_term   = cost_coeffs[2]
    m_term   = cost_coeffs[3]
    c_m_term = cost_coeffs[4] 
    constant = cost_coeffs[5]
    
    x_sphere = sphere[0]
    y_sphere = sphere[1]
    z_sphere = sphere[2]

    var old_cost = (c_square*intercept*intercept) + (m_square*slope*slope)
    + (c_term*intercept) + (m_term*slope) + (c_m_term*intercept*slope)
    + constant
    
    
    var new_slope     = ( (y[1] - y[0])/(x[1] - x[0] + 0.000001) )
    var new_intercept = ( y[1] - new_slope * x[0])
    
    var new_x_sphere = new Array(x_sphere.length)
    var new_y_sphere = new Array(y_sphere.length)
    var new_z_sphere = new Array(z_sphere.length)
    
    for(i = 0; i < x_sphere.length; i++)
    {
        console.log(new_slope,slope)
        new_x_sphere[i] = x_sphere[i] + new_slope - slope
    }
    
    for(i = 0; i < y_sphere.length; i++)
    {
        new_y_sphere[i] = y_sphere[i] + new_intercept - intercept 
        
    }
    
    var new_cost = (c_square*new_intercept*new_intercept) + (m_square*new_slope*new_slope)
    + (c_term*new_intercept) + (m_term*new_slope) + (c_m_term*new_intercept*new_slope)
    + constant
    
    for(i = 0; i < z_sphere.length; i++)
    {
        new_z_sphere[i] = z_sphere[i] + new_cost - old_cost
    }
    
    
    
    var new_x_sphere_2_D = new Array(Math.sqrt(x_sphere.length))
    
    for(i = 0; i < Math.sqrt(new_x_sphere.length); i++)
    {
        new_x_sphere_2_D[i] = new Array(Math.sqrt(new_x_sphere.length));
        
        for(j = 0; j < Math.sqrt(new_x_sphere.length); j++)
        {
            new_x_sphere_2_D[i][j] = new_x_sphere[j + i*(Math.sqrt(new_x_sphere.length))]
        }
    }
    
    var new_y_sphere_2_D = new Array(Math.sqrt(new_y_sphere.length))
    
    for(i = 0; i < Math.sqrt(new_y_sphere.length); i++)
    {
        new_y_sphere_2_D[i] = new Array(Math.sqrt(new_y_sphere.length));
        
        for(j = 0; j < Math.sqrt(new_y_sphere.length); j++)
        {
            new_y_sphere_2_D[i][j] = new_y_sphere[j + i*(Math.sqrt(new_y_sphere.length))]
        }
    }
    
    var new_z_sphere_2_D = new Array(Math.sqrt(new_z_sphere.length))
    
    for(i = 0; i < Math.sqrt(new_z_sphere.length); i++)
    {
        new_z_sphere_2_D[i] = new Array(Math.sqrt(new_z_sphere.length));
        
        for(j = 0; j < Math.sqrt(new_z_sphere.length); j++)
        {
            new_z_sphere_2_D[i][j] = new_z_sphere[j + i*(Math.sqrt(new_z_sphere.length))]
        }
    }
    
    sphere_data['x'] = new_x_sphere_2_D
    sphere_data['y'] = new_y_sphere_2_D
    sphere_data['z'] = new_z_sphere_2_D
    
    
    Plotly.update(id, [cost_data, sphere_data])
