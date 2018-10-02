import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  purchaseType: string = '';
  price: number = null;
  results: {};
  resultsHistory: Object[] = [];

  firstTimeBuyerTaxRules = [
    {
      fromAmount: 0,
      toAmount: 300000,
      taxPercent: 0
    },
    {
      fromAmount: 300001,
      toAmount: 500000,
      taxPercent: 5
    }
  ];
  generalTaxRules = [
    {
      fromAmount: 0,
      toAmount: 125000,
      taxPercent: 0
    },
    {
      fromAmount: 125001,
      toAmount: 250000,
      taxPercent: 2
    },
    {
      fromAmount: 250001,
      toAmount: 925000,
      taxPercent: 5
    },
    {
      fromAmount: 925001,
      toAmount: 1500000,
      taxPercent: 10
    },
    {
      fromAmount: 1500001,
      toAmount: 5000000,
      taxPercent: 12
    }
  ];
  specialTaxRules = [
    {
      fromAmount: 0,
      toAmount: 125000,
      taxPercent: 3
    },
    {
      fromAmount: 125001,
      toAmount: 250000,
      taxPercent: 5
    },
    {
      fromAmount: 250001,
      toAmount: 925000,
      taxPercent: 8
    },
    {
      fromAmount: 925001,
      toAmount: 1500000,
      taxPercent: 13
    },
    {
      fromAmount: 1500001,
      toAmount: 5000000,
      taxPercent: 15
    }
  ];

  calculate(): void {
    const { purchaseType, price, firstTimeBuyerTaxRules, generalTaxRules, specialTaxRules } = this;
    let rules: Object[];
    switch (purchaseType) {
      case 'First Time Buyer': {
        rules = (price > 500000 ? generalTaxRules : firstTimeBuyerTaxRules);
        break;
      }
      case 'Home Mover': {
        rules = generalTaxRules;
        break;
      }
      case 'Additional Property': {
        rules = specialTaxRules;
        break;
      }
    }

    if (rules) {
      this.buildTaxResult(this.price, rules);
    }

    this.purchaseType = '';
    this.price = null;
  }

  buildTaxResult(price, results): void {
    let portion: number = 0;
    let totalTaxAmount: number = 0;
    for (const result of results) {
      if (price >= result.fromAmount && price <= result.toAmount) {
        // when the price matches the rule
        result.taxableAmount = price - portion;
        result.taxAmount = result.taxableAmount * result.taxPercent / 100;
        totalTaxAmount = totalTaxAmount + result.taxAmount;
        break;
      } else {
        // if the price is greater than the rule
        result.taxableAmount = result.toAmount - portion;
        result.taxAmount = result.taxableAmount * result.taxPercent / 100;
        totalTaxAmount = totalTaxAmount + result.taxAmount;
        portion = result.toAmount;
      }
    }
    this.results = {
      'purchaseType': this.purchaseType,
      'price': this.price,
      'totalTaxAmount': totalTaxAmount,
      'breakdown': results
    };
    this.resultsHistory.push(this.results);
  }
}
