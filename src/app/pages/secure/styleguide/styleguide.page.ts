import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-styleguide',
  templateUrl: './styleguide.page.html',
  styleUrls: ['./styleguide.page.scss'],
})
export class StyleguidePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  diaryEntries = [
    {
      date: '2024-05-21',
      transactions: [
        { account: 'Caja', debit: '100.00', credit: '' },
        { account: 'Ventas', debit: '', credit: '100.00' },
      ],
    },
    {
      date: '2024-05-22',
      transactions: [
        { account: 'Bancos', debit: '200.00', credit: '' },
        { account: 'Clientes', debit: '', credit: '200.00' },
      ],
    },
  ];

}
