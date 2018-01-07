import numpy as np



def _create_surface(cost_expr, xrange=(0,1), yrange=(0,1), grid_dims={'x':20, 'y':20}):
    slope_samples = np.linspace(xrange[0], xrange[1], num=grid_dims['x'])
    intercept_samples = np.linspace(yrange[0], yrange[1], num=grid_dims['y'])

    x_grid, y_grid = np.meshgrid(slope_samples, intercept_samples)
    z_grid = np.zeros_like(x_grid)

    for i in range(len(x_grid)):
        for j in range(len(x_grid[0])):
            z_grid[i,j] = cost_expr.subs([('m', x_grid[i,j]), ('c', y_grid[i,j])])
    
    return {'x':x_grid, 'y':y_grid, 'z':z_grid}
    
    
    
def _create_marker(center={'x':0,'y':0,'z':0}, radius=1.0, scaling={'x':1.0,'y':1.0,'z':1.0}, grid_dim=20):
    theta = np.linspace(0,2*np.pi,grid_dim)
    phi   = np.linspace(0,np.pi,grid_dim)

    x_sphere = center['x'] + np.outer(radius * scaling['x'] * np.cos(theta), np.sin(phi))
    y_sphere = center['y'] + np.outer(radius * scaling['y'] * np.sin(theta), np.sin(phi))
    z_sphere = center['z'] + np.outer(radius * scaling['z'] * np.ones(20), np.cos(phi))  
    
    return {'x':x_sphere, 'y':y_sphere, 'z':z_sphere}