    // cb_obj is the Bokeh slider whose value was changed
    var slider_value = cb_obj.value;
    var title = cb_obj.title;

    if (title == "Slope")
    {
        new_slope = slider_value
        new_intecept = intercept
    }
    else
    {
        new_slope = slope
        new_intercept = slider_value
    }
    
    xy_extents = xy_extents.data
    
    x_extents = xy_extents['x']
    y_extents = xy_extents['y']
    x_min = x_extents[0]
    x_max = x_extents[1]
    y_min = y_extents[0]
    y_max = y_extents[1]
    
    
    var slope = (y_max - y_min)/(x_max - x_min + 0.00001);
    var intercept = y_min - slope * x_min;

    

    c_square = cost_coeffs['c**2']
    m_square = cost_coeffs['m**2']
    c_term   = cost_coeffs['c']
    m_term   = cost_coeffs['m']
    c_m_term = cost_coeffs['c*m'] 
    constant = cost_coeffs['1']
    
    var old_cost = (c_square*intercept*intercept) + (m_square*slope*slope)
    + (c_term*intercept) + (m_term*slope) + (c_m_term*intercept*slope)
    + constant
    
    var new_cost = (c_square*new_intercept*new_intercept) + (m_square*new_slope*new_slope)
    + (c_term*new_intercept) + (m_term*new_slope) + (c_m_term*new_intercept*new_slope)
    + constant
    
    // Update line and cost plots which are actually Plotly
    // plots through ugly DOM / javascript manipulation.
    
    var id = document.getElementsByClassName('plotly-graph-div js-plotly-plot')[0].id
    
    var plotDiv = document.getElementById(id);
    var plotData = plotDiv.data;
    
    var cost_data = plotData[0]
    var sphere_data = plotData[1]
    
    
    cost_coeffs = cost_coeffs.data['coeffs'];
    x_sphere = sphere_coordinates.data['x'];
    y_sphere = sphere_coordinates.data['y'];
    z_sphere = sphere_coordinates.data['z'];
    

   
    
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
