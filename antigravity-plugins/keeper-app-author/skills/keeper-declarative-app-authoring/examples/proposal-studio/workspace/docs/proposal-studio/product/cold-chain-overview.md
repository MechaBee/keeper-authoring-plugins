# Larkspur Cold Chain: module overview

Cold Chain puts a gateway on each refrigerated unit or cold store and streams temperature, door and
power events every 60 seconds.

## Hardware

- **Gateway**: connects to the refrigeration unit's controller over its data port. It has its own
  4G connection and a 48-hour battery, so it keeps reporting when the vehicle is off.
- **Wireless probes**: optional, for multi-compartment trailers and cold stores.

## Supported refrigeration units

- Thermo King SR-4 controllers and later.
- Carrier Transicold Vector and Supra series with the TRU-Link port.
- Older units can use wireless probes only, without controller data.

## Alerting

Rules fire on the size and duration of an excursion, for example "more than 2 °C above setpoint
for more than 5 minutes". Alerts go to the app, by SMS and by phone call. With the monitoring
service (sold separately) our desk receives every alert and calls the customer's duty contact.

## Records and audits

Every reading is kept with its source and time. Quality teams can export an audit report per
vehicle, journey, customer delivery or date range as PDF or CSV.

## Rollout

A typical depot of 15 to 20 vehicles is fitted in two days. See the implementation playbook.
