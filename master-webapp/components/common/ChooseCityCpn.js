import React, { Component } from "react";
import ChinaAreaData from "china-area-data"
import AnimatedDiv from "./animtedDiv"
import Modal from "./modal"


export default class ChooseCityCpn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            province: 0,
            city: 0,
            area: 0,
            provinceName: "",
            cityName: "",
            areaName: "",

            currentChoose: 0,
            visible: 0
        }
    }

    static defaultProps = {
        title: "地址选择"
    }

    componentDidMount() {
        document.getElementById("chooseCityBox").addEventListener("touchmove", (e) => {
            e.stopPropagation();
            // e.preventDefault();
        })
    }

    regionData() {
        let provinces = [], china = ChinaAreaData["86"];
        for (const provinceCode in china) {
            const province = {
                value: provinceCode,
                label: china[provinceCode]
            };
            let provinceChildren = [], cities = ChinaAreaData[provinceCode];
            for (const cityCode in cities) {
                const city = {
                    value: cityCode,
                    label: cities[cityCode],
                    children: []
                };
                const districts = ChinaAreaData[cityCode];
                for (const districtCode in districts) {
                    city.children.push({
                        value: districtCode,
                        label: districts[districtCode]
                    });
                }
                provinceChildren.push(city);
            }
            province.children = provinceChildren;
            provinces.push(province);
        }
        return provinces;
    }


    changeCurrentClick(index) {
        this.setState({
            currentChoose: index
        })
    }

    show() {
        this.modal.show();
    }

    hide = () => {
        this.modal.hide();
    }

    submit(v, l) {
        this.hide();
        this.props.onChange && this.props.onChange({
            target: {
                city: l,
                value: v
            }
        })
    }


    render() {
        return this.renderModal();
    }

    renderUnder() {
        return <div className="fs-gold marginRight6"
            style={{ position: "relative" }}>
            请选择
                <span style={{
                display: "block",
                width: "1rem",
                height: ".25rem",
                position: "absolute",
                bottom: "-5px",
                background: "#CF9F41",
                borderRadius: "5rem",
                left: ".35rem"
            }}

            ></span>
        </div >
    }

    renderModal() {
        const { title } = this.props
        const { visible } = this.state
        return (<Modal ref={ref => this.modal = ref}>
            <div className={"chooseCityBox"} id="chooseCityBox">
                <div className="chooseCityInfo">
                    <div className="chooseHeader">
                        <div className="chooseCityTop">{title}</div>
                        <div className="chooseCityTopText">
                            {
                                this.state.currentChoose === 2 &&
                                (<div>
                                    <span className="marginRight6" onClick={() => {
                                        this.changeCurrentClick(0)
                                    }}>{this.state.provinceName}</span>
                                    <span className="marginRight6" onClick={() => {
                                        this.changeCurrentClick(1)
                                    }}>{this.state.cityName}</span>
                                    {this.renderUnder()}
                                </div>)
                            }

                            {
                                this.state.currentChoose === 1 &&
                                (<div>
                                    <span className="marginRight6" onClick={() => {
                                        this.changeCurrentClick(0)
                                    }}>{this.state.provinceName}</span>
                                    {this.renderUnder()}
                                </div>)
                            }

                            {
                                this.state.currentChoose === 0 &&
                                (<div>
                                    {this.renderUnder()}
                                </div>)
                            }
                        </div>
                    </div>

                    {
                        this.state.currentChoose === 0 &&
                        <div className="chooseScroll">
                            {
                                this.regionData().map((province, index) => {
                                    return (
                                        <div key={index}
                                            onClick={() => {
                                                this.setState({
                                                    province: province.value,
                                                    provinceName: province.label,
                                                    currentChoose: 1
                                                })
                                            }}>{province.label}</div>
                                    )
                                })
                            }
                        </div>
                    }

                    {
                        this.state.currentChoose === 1 &&
                        <div className="chooseScroll">
                            {
                                this.regionData().map(province => {
                                    if (province.value === this.state.province) {
                                        return province.children.map((city, index) => {
                                            return (
                                                <div key={index}
                                                    onClick={() => {
                                                        this.setState({
                                                            city: city.value,
                                                            cityName: city.label,
                                                            currentChoose: 2
                                                        })
                                                    }}>{city.label}</div>
                                            )
                                        })
                                    }
                                })

                            }
                        </div>
                    }

                    {
                        this.state.currentChoose === 2 &&
                        <div className="chooseScroll">
                            {
                                this.regionData().map(province => {
                                    if (province.value === this.state.province) {
                                        return province.children.map(city => {
                                            if (city.value === this.state.city) {
                                                return city.children.map((area, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={() => {
                                                                this.setState({
                                                                    area: area.value,
                                                                    areaName: area.label,
                                                                    currentChoose: 2
                                                                })
                                                                this.submit(area.value, this.state.provinceName + " " + this.state.cityName + " " + area.label)
                                                            }}>{area.label}</div>
                                                    )
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        </div>
                    }

                </div>
            </div>
        </Modal>

        )
    }

}
