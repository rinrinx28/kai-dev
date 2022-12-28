import { useQuery } from "react-query";
import { ethers } from "ethers";
import { getSold } from "../api/serverapi";
import "chart.js/auto";
import "chartjs-adapter-moment";
import { Line, Bar } from "react-chartjs-2";
import outliers from "outliers";

export function Lines({ filter, collection, outlier }) {
  const chart_sold = useQuery(
    "get-chart-sold",
    () => {
      // Type : DESC Gần Nhất // ASC Lâu nhất
      return getSold(collection, "ASC");
    },
    { refetchInterval: 5000 },
  );

  var label =
    chart_sold.data !== undefined
      ? chart_sold.data
          .filter((v) => {
            if (filter === "All") {
              return `${v.closing_date}`;
            } else {
              var now1 =
                Math.floor(new Date().getTime() / 1000.0) -
                86400 * Number(filter.split("D")[0]);
              var day1 = Math.floor(
                new Date(v.closing_date).getTime() / 1000.0,
              );
              if (day1 >= now1) {
                return `${v.closing_date}`;
              }
            }
            return null;
          })
          .map((v) => {
            return `${new Date(v.closing_date)}`;
          })
      : null;
  if (label !== null) {
    filter === "All"
      ? label.push(
          `${new Date(
            Math.floor(
              new Date(label[label.length - 1]).getTime() / 1000.0 + 86400 * 2,
            ) * 1000,
          )}`,
        )
      : label.push(
          `${new Date(
            Math.floor(
              new Date(label[label.length - 1]).getTime() / 1000.0 +
                3600 *
                  (Number(filter.split("D")[0]) === 1
                    ? 3
                    : Number(filter.split("D")[0]) >= 7
                    ? Number(filter.split("D")[0]) + 6
                    : Number(filter.split("D")[0]) + 3),
            ) * 1000,
          )}`,
        );
  }
  var data =
    chart_sold.data !== undefined
      ? chart_sold.data
          .filter((v) => {
            if (filter === "All") {
              return {
                x: `${new Date(v.closing_date)}`,
                y: ethers.utils.formatEther(`${v.sale_price}`),
                data: v.hash_tx,
              };
            } else {
              var now1 =
                Math.floor(new Date().getTime() / 1000.0) -
                86400 * Number(filter.split("D")[0]);
              var day1 = Math.floor(
                new Date(v.closing_date).getTime() / 1000.0,
              );
              if (day1 >= now1) {
                return {
                  x: `${new Date(v.closing_date)}`,
                  y: ethers.utils.formatEther(`${v.sale_price}`),
                  data: v.hash_tx,
                };
              }
            }
            return null;
          })
          .map((v) => {
            return {
              x: `${v.closing_date}`,
              y: Number(ethers.utils.formatEther(`${v.sale_price}`)),
              data: v.hash_tx,
            };
          })
      : null;

  const datas_s = {
    labels: label,
    datasets: [
      {
        label: "Trades",
        data: outlier
          ? data
          : data !== null
          ? data.filter(outliers("y"))
          : null,
        backgroundColor: "rgb(54 162 235 / 0.4)",
        pointRadius: 6,
      },
    ],
  };
  const options = {
    responsive: true,
    elements: {
      line: {
        borderColor: "transparent",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,

        external: function (context) {
          // Tooltip Element
          var tooltipEl = document.getElementById("chartjs-tooltip");

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.innerHTML = '<div class="tooltip_div"></div>';
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          var tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Set caret Position
          tooltipEl.classList.remove("above", "below", "no-transform");
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
            tooltipEl.classList.add("no-transform");
          }

          // Set Text
          if (tooltipModel.body) {
            var titleLines = tooltipModel.title || [];
            // var bodyLines = tooltipModel.body.map(getBody);
            var innerHtml = '<div class="tooltip_div_snd m-2">';

            titleLines.forEach(function (title) {
              // innerHtml += "<tr><th>" + title + "</th></tr>";
              innerHtml +=
                '<p class="text-xs text-white font-sans font-extralight">' +
                title +
                "</p>";
            });

            const datas = chart_sold.data?.filter(
              (v) =>
                Math.floor(new Date(v.closing_date).getTime() / 1000.0) ===
                Math.floor(new Date(titleLines[0]).getTime() / 1000.0),
            );
            innerHtml +=
              '<p class="text-xs text-white font-sans font-extralight mt-2">Traded at ' +
              ethers.utils.formatEther(`${datas[0].sale_price}`) +
              " ETH" +
              "</p>";
            innerHtml +=
              '<p class="text-xs text-white font-sans font-extralight mt-2">Token: ' +
              datas[0].token_name +
              "</p>";
            innerHtml += "</div>";
            var img = `<img src="${datas[0].image_url}" alt="${datas[0].token_name}" width="120" height="120" class="mb-2 rounded-lg" >`;
            innerHtml += img;

            var tableRoot = tooltipEl.querySelector("div");
            tableRoot.innerHTML = innerHtml;
          }

          var position = context.chart.canvas.getBoundingClientRect();
          var left = Math.floor(position.x - 70); // Center Tooltip Info
          var top = Math.floor(position.y + window.pageYOffset - 230);

          // Display, position, and set styles for font
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = "absolute";
          tooltipEl.style.left = left + tooltipModel.caretX + "px";
          tooltipEl.style.top = top + tooltipModel.caretY + "px";
          tooltipEl.style.padding =
            tooltipModel.padding + "px " + tooltipModel.padding + "px";
          tooltipEl.style.pointerEvents = "none";
        },
      },
    },
    scales: {
      y: {
        grid: {
          display: true,
          color: "rgb(255 255 255 / 0.5)",
        },
        ticks: {
          display: true,
          color: "rgb(255 255 255 / 0.8)",
          lineWidth: 5,
          padding: 5,
          z: 1000,
        },
        title: {
          display: true,
          text: "Price ( ETH )",
          color: "rgb(255 255 255 / 0.8)",
          align: "center",
          font: {
            size: 14,
          },
        },
      },
      x: {
        grid: {
          display: true,
          tickColor: "rgb(255 255 255 / 0.8)",
        },
        ticks: {
          display: true,
          padding: 5,
          align: "center",
          color: "rgb(255 255 255 / 0.8)",
          font: (context) => {
            const boledTicks = context.tick && context.tick.major ? "bold" : "";
            return { weight: boledTicks, size: 14 };
          },
          major: {
            enabled: true,
          },
        },
        type: "time",
      },
    },
    layout: {
      autoPadding: true,
    },
  };

  return (
    <>
      <Line data={datas_s} options={options} id="linechart" className="m-4" />
    </>
  );
}

export function Bars({ collection }) {
  const chart_sold = useQuery(
    "get-chart-sold",
    () => {
      // Type : DESC Gần Nhất // ASC Lâu nhất
      return getSold(collection, "ASC");
    },
    { refetchInterval: 5000 },
  );

  var data_test =
    chart_sold.data !== undefined
      ? chart_sold.data.map((v) => {
          return {
            x: `${new Date(v.closing_date).toDateString()}`,
            y: Number(ethers.utils.formatEther(`${v.sale_price}`)),
            numsale: 0,
            avg: 0,
          };
        })
      : null;
  const supply = Object.values(
    data_test !== null
      ? data_test.reduce((obj, data) => {
          const key = data.x;
          const dayResult = obj[key];
          if (dayResult) {
            dayResult.y += data.y;
            dayResult.numsale += 1;
          } else {
            obj[key] = { ...data };
          }
          return obj;
        }, {})
      : 0,
  );

  const all_sale = Object.values(
    data_test !== null
      ? data_test.reduce((obj, data) => {
          const key = data.x;
          const dayResult = obj[key];
          if (dayResult) {
            dayResult.y += `,${data.y}`;
            dayResult.numsale += 1;
          } else {
            obj[key] = { ...data };
          }
          return obj;
        }, {})
      : 0,
  );

  const datas_s = {
    labels: supply.map((v) => v.x),
    datasets: [
      {
        label: "Trades",
        data: supply.map((v) => {
          return { x: v.x, y: v.y };
        }),
        backgroundColor: "rgb(54 162 235 /0.6)",
        yAxisID: "eth",
        order: 2,
      },
      {
        label: "Numsale",
        data: all_sale.map((v) => {
          return {
            x: v.x,
            y:
              String(v.y)
                .split(",")
                .reduce((a, b) => Number(a) + Number(b), 0) /
              String(v.y).split(",").length,
          };
        }),
        pointRadius: 0,
        hoverBackgroundColor: "#4666ff",
        borderColor: "rgb(54 162 235)",
        pointHoverRadius: 6,
        yAxisID: "avgprice",
        showLine: true,
        type: "line",
        order: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    elements: {
      bar: {
        borderColor: "transparent",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      eth: {
        grid: {
          display: true,
          color: "rgb(255 255 255 / 0.5)",
        },
        ticks: {
          display: true,
          color: "rgb(255 255 255 / 0.8)",
          lineWidth: 5,
          padding: 5,
          z: 1000,
        },
        title: {
          display: true,
          text: "Price ( ETH )",
          color: "rgb(255 255 255 / 0.8)",
          align: "center",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        tpye: "logarithmic",
        position: "left",
      },
      avgprice: {
        tpye: "logarithmic",
        position: "right",
        title: {
          display: true,
          text: "Average price ( ETH )",
          color: "rgb(255 255 255 / 0.8)",
          align: "center",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          display: true,
          color: "rgb(255 255 255 / 0.8)",
          lineWidth: 5,
          padding: 5,
          z: 1000,
        },
      },
      x: {
        grid: {
          display: true,
          tickColor: "rgb(255 255 255 / 0.8)",
        },
        ticks: {
          display: true,
          padding: 5,
          align: "center",
          color: "rgb(255 255 255 / 0.8)",
        },
        type: "time",
        time: {
          unit: "day",
        },
      },
    },
    layout: {
      padding: 20,
    },
  };

  return (
    <>
      <Bar data={datas_s} options={options} id="linechart" className="m-4" />
    </>
  );
}
