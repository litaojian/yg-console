import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';

// dashboard pages
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
import { SimpleTableComponent } from './simple-table/simple-table.component';

// passport pages
import { UserLoginComponent } from './passport/login/login.component';

// single pages
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

import { CanActivateMenusProvide } from '../admin/services/can-activate.menus.provide';

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        canActivate: [ CanActivateMenusProvide ],  
        children: [
            { path: '', redirectTo: 'dashboard/monitor', pathMatch: 'full' },
            { path: 'dashboard', redirectTo: 'dashboard/monitor', pathMatch: 'full' },
            { path: 'dashboard/monitor', component: DashboardMonitorComponent, data: { translate: 'dashboard_monitor' } },
            { path: 'trackSearch', loadChildren: '../vehicle/VehicleSearch/trackSearch.module#TrackModule'},
            { path: 'regional', loadChildren: '../vehicle/VehicleArea/regional.module#RegionalModule'} 
        ]
    },
    // // 全屏布局y
    // {
    //     path: 'data-v',
    //     component: LayoutFullScreenComponent,
    //     children: [
    //         { path: '', loadChildren: './data-v/data-v.module#DataVModule' }
    //     ]
    // },
    // passport
    {
        path: 'passport',
        component: LayoutPassportComponent,
        children: [
            { path: 'login', component: UserLoginComponent }
        ]
    },
    // 单页不包裹Layout
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }
